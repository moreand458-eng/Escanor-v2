// ════════════════════════════════════════
//  قسم التطوير - نظام القلعة 🏰
// ════════════════════════════════════════

// ══ صور لكل مستوى - استبدلها بصورك ══
const IMG = {
    castle:  [
        'https://i.postimg.cc/L8Kd2Y5x/castle-lv1.jpg', // lv1
        'https://i.postimg.cc/Y0WQ4RKH/castle-lv2.jpg', // lv2
        'https://i.postimg.cc/7LMnfPVP/castle-lv3.jpg', // lv3
        'https://i.postimg.cc/9FTBrHGJ/castle-lv4.jpg', // lv4
    ],
    weapon:  [
        'https://i.postimg.cc/L8Kd2Y5x/weapon-lv1.jpg',
        'https://i.postimg.cc/Y0WQ4RKH/weapon-lv2.jpg',
        'https://i.postimg.cc/7LMnfPVP/weapon-lv3.jpg',
        'https://i.postimg.cc/9FTBrHGJ/weapon-lv4.jpg',
    ],
    armor:   [
        'https://i.postimg.cc/L8Kd2Y5x/armor-lv1.jpg',
        'https://i.postimg.cc/Y0WQ4RKH/armor-lv2.jpg',
        'https://i.postimg.cc/7LMnfPVP/armor-lv3.jpg',
        'https://i.postimg.cc/9FTBrHGJ/armor-lv4.jpg',
    ],
    soldier: [
        'https://i.postimg.cc/L8Kd2Y5x/soldier-lv1.jpg',
        'https://i.postimg.cc/Y0WQ4RKH/soldier-lv2.jpg',
        'https://i.postimg.cc/7LMnfPVP/soldier-lv3.jpg',
        'https://i.postimg.cc/9FTBrHGJ/soldier-lv4.jpg',
    ],
};

const COSTS = {
    weapon:  [0, 100, 300, 700],
    armor:   [0, 120, 350, 800],
    soldier: [0,  80, 200, 500],
    castle:  [0, 200, 600, 1500],
};

const NAMES = {
    weapon:  ['—', '🗡️ سيف خشبي',    '⚔️ سيف حديدي',  '🔱 سيف أسطوري', '💎 سيف الإله'],
    armor:   ['—', '🩱 درع قماش',     '🛡️ درع حديدي',  '⚜️ درع ذهبي',   '👑 درع الأبطال'],
    soldier: ['—', '🪖 مبتدئ',        '⚔️ محارب',      '🐉 فارس',       '👹 جنرال'],
    castle:  ['—', '🏚️ كوخ',         '🏠 قلعة صغيرة', '🏰 قلعة كبيرة', '🏯 قلعة الملوك'],
};

// نقاط كل نوع إحالة
const REF_PTS = { channel: 150, group: 70, bot: 90 };

// ══ DB ══
const getDB = () => {
    if (!global._gs) global._gs = {};
    if (!global._gs.__castle) global._gs.__castle = {};
    return global._gs.__castle;
};
const getP = (jid) => {
    const db = getDB();
    if (!db[jid]) db[jid] = { points:0, weapon:1, armor:1, soldier:1, castle:1, cmdCount:0, usedRefs:[] };
    return db[jid];
};
const castleLvl = (p) => Math.min(Math.floor((p.weapon + p.armor + p.soldier + p.castle) / 4), 4);

// ══ encode/decode رقم المستخدم ══
const encodeNum = (jid) => Buffer.from(jid.split('@')[0]).toString('base64url');
const decodeNum = (code) => { try { return Buffer.from(code, 'base64url').toString() + '@s.whatsapp.net'; } catch { return null; } };

// ══ عرض القلعة ══
const showCastle = async (m, conn, p, jid) => {
    const img = IMG.castle[Math.min(p.castle - 1, 3)];
    const name = m.pushName || jid.split('@')[0];
    const lvl = castleLvl(p);
    await conn.sendMessage(m.chat, {
        image: { url: img },
        caption:
            `╭──────────────────╮\n` +
            `┃ 🏰 *قلعة ${name}*\n` +
            `╰──────────────────╯\n\n` +
            `💰 *النقاط:* ${p.points}\n` +
            `📊 *المستوى:* ${lvl}/4\n\n` +
            `🗡️ ${NAMES.weapon[p.weapon]}\n` +
            `🛡️ ${NAMES.armor[p.armor]}\n` +
            `⚔️ ${NAMES.soldier[p.soldier]}\n` +
            `🏰 ${NAMES.castle[p.castle]}\n\n` +
            `*.طور_سلاح* ┃ *.طور_درع*\n` +
            `*.طور_جنود* ┃ *.طور_قلعة*\n` +
            `*.روابطي* ← لجلب نقاط`
    }, { quoted: m });
};

// ══ ترقية ══
const upgrade = async (m, conn, jid, item) => {
    const db = getDB();
    if (!db[jid]) return m.reply('*❌ سجل الأول:* *.تسجيل_تطوير*');
    const p = db[jid];
    const cur = p[item];
    if (cur >= 4) {
        return conn.sendMessage(m.chat, {
            image: { url: IMG[item][3] },
            caption: `*✅ وصلت للحد الأقصى!*\n${NAMES[item][4]} 🏆`
        }, { quoted: m });
    }
    const next = cur + 1;
    const cost = COSTS[item][next - 1];
    if (p.points < cost) {
        return m.reply(
            `*❌ نقاطك مش كفاية*\n\n` +
            `┃ عندك: *${p.points}* نقطة\n` +
            `┃ محتاج: *${cost}* نقطة\n\n` +
            `*.روابطي* لجلب نقاط إضافية`
        );
    }
    p.points -= cost;
    p[item]   = next;
    await conn.sendMessage(m.chat, {
        image: { url: IMG[item][next - 1] },
        caption:
            `*✅ تم التطوير!*\n\n` +
            `${NAMES[item][cur]} ⟶ *${NAMES[item][next]}*\n\n` +
            `💰 باقي: *${p.points}* نقطة`
    }, { quoted: m });
};

// ══ معالجة الإحالة ══
// يتشغل من: group event (انضم جروب) + private (دخل البوت) + أمر يدوي
const handleRef = async (conn, newJid, refCode, type) => {
    const ownerJid = decodeNum(refCode);
    if (!ownerJid) return false;

    const db = getDB();
    if (!db[ownerJid]) return false;         // صاحب الرابط مش مسجل
    if (ownerJid === newJid) return false;   // مينفعش تحيل نفسك

    const owner = db[ownerJid];
    if (!owner.usedRefs) owner.usedRefs = [];
    // منع التكرار من نفس الشخص لنفس النوع
    const usedKey = `${newJid}:${type}`;
    if (owner.usedRefs.includes(usedKey)) return false;

    owner.usedRefs.push(usedKey);
    const pts = REF_PTS[type] || 50;
    owner.points = (owner.points || 0) + pts;

    // إشعار صاحب الرابط
    try {
        await conn.sendMessage(ownerJid, {
            text:
                `*🎉 +${pts} نقطة إحالة ${type === 'channel' ? 'قناة' : type === 'group' ? 'جروب' : 'بوت'}!*\n\n` +
                `@${newJid.split('@')[0]} انضم عن طريق رابطك\n` +
                `💰 رصيدك دلوقتي: *${owner.points}* نقطة`,
            contextInfo: { mentionedJid: [newJid] }
        });
    } catch {}
    return pts;
};

export { handleRef, encodeNum };

// ══ Main Handler ══
const handler = async (m, { conn, command, bot }) => {
    const jid = m.sender;
    const db  = getDB();

    switch (command) {

        case 'تسجيل_تطوير': case 'تسجيل': {
            if (db[jid]) return m.reply(`*✅ أنت مسجل*\n💰 نقاطك: ${db[jid].points}`);
            getP(jid);
            return m.reply(
                `*🎉 تم التسجيل في نظام التطوير!*\n\n` +
                `🏰 قلعتك جاهزة — المستوى 1\n` +
                `💰 نقاطك: 0\n\n` +
                `*.روابطي* ← جلب روابطك الشخصية\n` +
                `*.كيف_اجمع_نقاط* ← طرق التجميع`
            );
        }

        case 'قلعتي': case 'تطويري': {
            if (!db[jid]) return m.reply('*❌ سجل الأول:* *.تسجيل_تطوير*');
            return showCastle(m, conn, db[jid], jid);
        }

        case 'نقاطي': {
            if (!db[jid]) return m.reply('*❌ سجل الأول:* *.تسجيل_تطوير*');
            const p = db[jid];
            return m.reply(
                `*💰 نقاطك: ${p.points}*\n\n` +
                `🗡️ ${NAMES.weapon[p.weapon]}\n` +
                `🛡️ ${NAMES.armor[p.armor]}\n` +
                `⚔️ ${NAMES.soldier[p.soldier]}\n` +
                `🏰 ${NAMES.castle[p.castle]}`
            );
        }

        case 'طور_سلاح':  return upgrade(m, conn, jid, 'weapon');
        case 'طور_درع':   return upgrade(m, conn, jid, 'armor');
        case 'طور_جنود':  return upgrade(m, conn, jid, 'soldier');
        case 'طور_قلعة':  return upgrade(m, conn, jid, 'castle');

        // ══ روابطي - يولد رابط شخصي لكل مستخدم ══
        case 'روابطي': case 'my_links': {
            if (!db[jid]) return m.reply('*❌ سجل الأول:* *.تسجيل_تطوير*');
            const code    = encodeNum(jid);
            const botNum  = bot?.config?.phoneNumber || '201092178171';
            const chanId  = bot?.config?.info?.idChannel?.replace('@newsletter','') || '120363422581600030';
            const grpId   = 'Hd5SRXu6WRX5njUtvT9e9e';

            // رابط البوت - لما حد يكتبه للبوت يتسجل الإحالة تلقائياً
            const botLink  = `https://wa.me/${botNum}?text=بوت_${code}`;
            // رابط الجروب - لما حد ينضم ويشوف رسالة الترحيب هيتسجل
            const grpLink  = `https://chat.whatsapp.com/${grpId}`;
            // رابط القناة
            const chanLink = `https://whatsapp.com/channel/${chanId}`;

            return conn.sendMessage(m.chat, {
                text:
                    `*🔗 روابطك الشخصية*\n` +
                    `_كودك:_ \`${code}\`\n\n` +
                    `━━━━━━━━━━━━━━━\n` +
                    `🤖 *رابط البوت* → *90 نقطة*\n` +
                    `${botLink}\n` +
                    `_(لما حد يفتح البوت من الرابط ده هتاخد نقاط تلقائياً)_\n\n` +
                    `👥 *رابط الجروب* → *70 نقطة*\n` +
                    `${grpLink}\n` +
                    `_(لما حد ينضم يكتب:_ \`.ref ${code}\`_)_\n\n` +
                    `📢 *رابط القناة* → *150 نقطة*\n` +
                    `${chanLink}\n` +
                    `_(لما حد يشترك يكتب:_ \`.ref ${code}\`_)_\n\n` +
                    `━━━━━━━━━━━━━━━\n` +
                    `⚡ كل 15 أمر = 10 نقاط تلقائياً`
            }, { quoted: m });
        }

        // ══ ref - تسجيل إحالة يدوي (للجروب والقناة) ══
        case 'ref': case 'مرجع': {
            const code = (m.text || m.body || '').trim().split(/\s+/)[1];
            if (!code) return m.reply('*📌 مثال:* `.ref YOURCODE`');
            const ownerJid = decodeNum(code);
            if (!ownerJid) return m.reply('*❌ كود غير صحيح*');
            if (ownerJid === jid) return m.reply('*❌ مينفعش تستخدم كودك بنفسك*');
            if (!db[ownerJid]) return m.reply('*❌ صاحب الكود ده مش مسجل*');

            const owner = db[ownerJid];
            if (!owner.usedRefs) owner.usedRefs = [];
            const key = `${jid}:manual`;
            if (owner.usedRefs.includes(key)) return m.reply('*❌ استخدمت كود صاحبك ده قبل كده*');

            owner.usedRefs.push(key);
            owner.points = (owner.points || 0) + 70;
            await m.reply('*✅ تم! صاحب الكود اخد 70 نقطة*');
            try {
                await conn.sendMessage(ownerJid, {
                    text:
                        `*🎉 +70 نقطة إحالة!*\n\n` +
                        `@${jid.split('@')[0]} استخدم كودك\n` +
                        `💰 رصيدك: *${owner.points}* نقطة`,
                    contextInfo: { mentionedJid: [jid] }
                });
            } catch {}
            break;
        }

        case 'كيف_اجمع_نقاط': {
            return m.reply(
                `*💡 طرق تجميع النقاط:*\n\n` +
                `┃ 🤖 حد يفتح البوت من رابطك → *90 نقطة تلقائياً*\n` +
                `┃ 👥 حد ينضم الجروب ويكتب كودك → *70 نقطة*\n` +
                `┃ 📢 حد يشترك القناة ويكتب كودك → *150 نقطة*\n` +
                `┃ 🔗 أي حد يكتب كودك يدوياً → *70 نقطة*\n` +
                `┃ ⚡ كل 15 أمر تكتبه → *10 نقاط تلقائياً*\n\n` +
                `*.روابطي* لجلب روابطك وكودك`
            );
        }

        case 'ترتيب_القلاع': case 'top_castle': {
            const sorted = Object.entries(db)
                .filter(([,p]) => typeof p?.points === 'number')
                .sort(([,a],[,b]) => b.points - a.points)
                .slice(0, 10);
            if (!sorted.length) return m.reply('*❌ مفيش لاعبين لحد دلوقتي*');
            const medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
            let txt = '*🏰 ترتيب القلاع:*\n\n';
            sorted.forEach(([j,p],i) => {
                txt += `${medals[i]} @${j.split('@')[0]} ┃ ${p.points} نقطة ┃ ${NAMES.castle[p.castle]}\n`;
            });
            await conn.sendMessage(m.chat, {
                text: txt,
                contextInfo: { mentionedJid: sorted.map(([j])=>j) }
            }, { quoted: m });
            break;
        }
    }
};

// نقاط الأوامر التلقائية
handler.before = async (m, ctx, bot) => {
    if (!m.sender) return false;
    const db = getDB();
    if (!db[m.sender]) return false;
    const pfx = (bot || ctx?.bot)?.config?.prefix || ['.','/',  '!'];
    const pfxArr = Array.isArray(pfx) ? pfx : [pfx];
    const body = (m.body || '').trim();
    if (!pfxArr.some(p => body.startsWith(p))) return false;
    const p = db[m.sender];
    p.cmdCount = (p.cmdCount || 0) + 1;
    if (p.cmdCount % 15 === 0) {
        p.points = (p.points || 0) + 10;
        try {
            await (ctx?.conn || ctx)?.sendMessage?.(m.chat, {
                text: `*⚡ +10 نقاط!*\nوصلت ${p.cmdCount} أمر 🎉\n💰 رصيدك: *${p.points}* نقطة`
            }, { quoted: m });
        } catch {}
    }
    return false;
};

handler.usage    = ['تسجيل_تطوير','قلعتي','نقاطي','روابطي'];
handler.category = 'dev';
handler.command  = [
    'تسجيل_تطوير','تسجيل','قلعتي','تطويري','نقاطي',
    'طور_سلاح','طور_درع','طور_جنود','طور_قلعة',
    'كيف_اجمع_نقاط','روابطي','my_links',
    'ref','مرجع','ترتيب_القلاع','top_castle'
];

export default handler;
