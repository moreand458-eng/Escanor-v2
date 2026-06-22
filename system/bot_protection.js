// bot_protection.js - حماية من تعارضات البوتات والأوامر المتزامنة

/**
 * يجمع كل الـ ids المحتملة لرقم/مستخدم معين (jid عادي + رقم خام + lid لو موجود)
 */
const allIdsOf = (...vals) => {
    const out = new Set();
    for (const v of vals) {
        if (!v) continue;
        out.add(v);
        const num = v.split('@')[0]?.split(':')[0];
        if (num) {
            out.add(`${num}@s.whatsapp.net`);
            out.add(`${num}@lid`);
            out.add(num);
        }
    }
    return out;
};

/**
 * فحص لو participant معين يطابق target (بمقارنة كل الحقول المحتملة: id, jid, lid, pn)
 * ضروري بسبب نظام LID في Baileys v7 اللي بيخلي meta.participants[].id يكون lid
 * مش رقم هاتف عادي، وممكن conn.user.id يكون بصيغة مختلفة
 */
const participantMatches = (p, targetIds) => {
    const candidates = allIdsOf(p.id, p.jid, p.lid, p.pn, p.phoneNumber);
    for (const c of candidates) {
        if (targetIds.has(c)) return true;
    }
    return false;
};

/**
 * فحص لو البوت نفسه ادمن فعلي (مش متأخر الـ metadata)
 * يجيب الـ metadata من جديد بدل ما يعتمد على الـ cache القديم
 * بيتعامل مع نظام LID في Baileys v7 (participant.id ممكن يكون @lid مش @s.whatsapp.net)
 */
export const isBotActualAdmin = async (chat, conn) => {
    try {
        const meta = await conn.groupMetadata(chat);
        if (!meta?.participants) return false;

        // كل الهويات المحتملة للبوت نفسه
        const botIds = allIdsOf(
            conn?.user?.id,
            conn?.user?.lid,
            conn?.user?.jid,
            conn?.user?.pn
        );

        const botParticipant = meta.participants.find(p => participantMatches(p, botIds));

        if (process.env.DEBUG_ADMIN_CHECK === '1') {
            console.log('[isBotActualAdmin] botIds:', [...botIds]);
            console.log('[isBotActualAdmin] conn.user:', conn?.user);
            console.log('[isBotActualAdmin] matched participant:', botParticipant);
        }

        return botParticipant?.admin === 'admin' || botParticipant?.admin === 'superadmin';
    } catch (e) {
        if (process.env.DEBUG_ADMIN_CHECK === '1') console.log('[isBotActualAdmin] error:', e?.message);
        return false;
    }
};

/**
 * فحص لو المستخدم ادمن فعلي (live check)
 * بيتعامل مع نظام LID في Baileys v7
 */
export const isUserActualAdmin = async (sender, chat, conn) => {
    try {
        const meta = await conn.groupMetadata(chat);
        if (!meta?.participants) return false;

        const senderIds = allIdsOf(sender);
        const userParticipant = meta.participants.find(p => participantMatches(p, senderIds));
        return userParticipant?.admin === 'admin' || userParticipant?.admin === 'superadmin';
    } catch {
        return false;
    }
};

/**
 * قائمة البوتات المعروفة (تعديل حسب احتياجك)
 * إضافة أي بوت تاني بتحتاج تتعامل معه
 */
const KNOWN_BOTS = [
    '6281234567890@s.whatsapp.net', // مثال
    '201234567890@s.whatsapp.net',   // أضف أرقام البوتات الأخرى
];

/**
 * فحص لو الرسالة من بوت معروف (تجاهله)
 */
export const isFromKnownBot = (sender) => {
    return KNOWN_BOTS.some(bot => 
        sender === bot || 
        sender.split(':')[0] + '@s.whatsapp.net' === bot
    );
};

/**
 * نظام الـ cooldown - منع تنفيذ نفس الأمر مرتين في نفس الثانية
 */
const commandCooldowns = new Map();
const COOLDOWN_MS = 2000; // ثانيتين

export const checkCommandCooldown = (cmd, sender, chat) => {
    const key = `${cmd}_${sender}_${chat}`;
    const now = Date.now();
    
    if (commandCooldowns.has(key)) {
        const lastTime = commandCooldowns.get(key);
        const elapsed = now - lastTime;
        
        if (elapsed < COOLDOWN_MS) {
            return { 
                allowed: false, 
                waitMs: COOLDOWN_MS - elapsed 
            };
        }
    }
    
    commandCooldowns.set(key, now);
    
    // تنظيف القديمة (أكبر من 5 دقائق)
    if (commandCooldowns.size > 1000) {
        for (const [k, v] of commandCooldowns.entries()) {
            if (now - v > 300_000) commandCooldowns.delete(k);
        }
    }
    
    return { allowed: true, waitMs: 0 };
};

/**
 * guard سريع: تحقق لو البوت ادمن وضيف البيانات الحقيقية (live) للـ message object
 * fallback: لو فشل الفحص الـ live في إيجاد تطابق، يحافظ على القيمة الأصلية
 * (اللي جايه من الـ engine) بدل ما يفترض إن البوت مش ادمن
 */
export const adminGuard = async (m, { conn, bot }) => {
    // تجاهل لو من بوت معروف
    if (isFromKnownBot(m.sender)) return false;

    const originalBotAdmin  = m.isBotAdmin;
    const originalUserAdmin = m.isAdmin;

    try {
        const liveBotAdmin  = await isBotActualAdmin(m.chat, conn);
        const liveUserAdmin = await isUserActualAdmin(m.sender, m.chat, conn);

        // الفحص الـ live نجح (مفيش استثناء) - نثق فيه بالكامل
        // سواء النتيجة true أو false، لأنه فحص حقيقي ولحظي من واتساب
        m.isBotAdmin = liveBotAdmin;
        m.isUserAdmin = liveUserAdmin;
    } catch {
        // لو حصل خطأ فعلي في الفحص (فشل شبكة مثلاً)، رجّع القيم الأصلية زي ما هي
        m.isBotAdmin  = originalBotAdmin;
        m.isUserAdmin = originalUserAdmin;
    }

    return false;
};

/**
 * helper: رسالة الخطأ موحدة
 */
export const notAdminMsg = () => 
    '*「💥」 ارفـعـني مـشـرف يـسـطـا وبـعـدين نـفـز الامـر*';

export const notAuthMsg = () => 
    '*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*';
