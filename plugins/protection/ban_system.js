// نظام الحظر - يشتغل مع المطورين والادمنز على الرئيسي والفرعي

const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

const isOwnerFn = (id, bot, conn) => {
    const owners = bot?.config?.owners || global._mainOwners || [];
    const botJid = conn?.user?.id?.split(':')[0] + '@s.whatsapp.net';
    return (
        owners.some(o => o.jid === id || o.lid === id) ||
        id === botJid ||
        id?.split(':')[0] + '@s.whatsapp.net' === botJid
    );
};

const canUse = (m, bot, conn) =>
    isOwnerFn(m.sender, bot, conn) || m.isAdmin || m.isSuperAdmin;

// ===== مساعد: جيب الرقم الأساسي من أي id =====
const numOf = (id) => id?.split('@')[0]?.split(':')[0] || '';

// ===== مساعد: شوف لو id موجود في قائمة (بيقارن بالرقم) =====
const isInList = (list, id) => {
    if (!list?.length || !id) return false;
    const n = numOf(id);
    return list.some(u => u === id || numOf(u) === n);
};

// ===== مساعد: امسح id من قائمة (بيمسح كل التطابقات بالرقم) =====
const removeFromList = (list, id) => {
    if (!list?.length || !id) return list || [];
    const n = numOf(id);
    return list.filter(u => u !== id && numOf(u) !== n);
};

// ===== updateParticipant محسنة - بتجرب lid وjid البديل =====
const updateParticipant = async (chat, target, action, conn) => {
    let meta;
    try { meta = await conn.groupMetadata(chat); } catch { meta = null; }

    const targetNum = numOf(target);
    const found = meta?.participants?.find(p => {
        return p.id === target || p.lid === target || p.jid === target || numOf(p.id) === targetNum;
    });

    const candidates = [...new Set([
        found?.id,
        found?.lid,
        found?.jid,
        target
    ].filter(Boolean))];

    let lastErr;
    for (const id of candidates) {
        try {
            await conn.groupParticipantsUpdate(chat, [id], action);
            return { ok: true };
        } catch (e) {
            lastErr = e;
            const msg = String(e?.message || e?.toString?.() || '').toLowerCase();
            const code = e?.output?.statusCode || e?.status;
            if (!(msg.includes('forbidden') || code === 403)) break;
        }
    }
    return { ok: false, error: lastErr };
};

const handler = async (m, { conn, command, bot }) => {
    if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');
    if (!canUse(m, bot, conn)) return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس*');

    const g = getG(m.chat);
    const target = m.mentionedJid?.[0] || m.quoted?.sender;

    // ===== حظر =====
    if (command === 'ban' || command === 'حظر') {
        if (!target) return m.reply('*منشن العضو أو رد على رسالته*');
        if (isOwnerFn(target, bot, conn)) return m.reply('*❌ لا يمكن حظر المطور*');
        if (!g.banned) g.banned = [];

        if (isInList(g.banned, target)) return conn.sendMessage(m.chat, {
            text: `*❌ @${target.split('@')[0]} محظور بالفعل*`, mentions: [target]
        });

        g.banned.push(target);

        if (m.isBotAdmin) {
            const res = await updateParticipant(m.chat, target, 'remove', conn);
            if (!res.ok) console.log('[ban] remove failed:', res.error?.message);
        }

        return conn.sendMessage(m.chat, {
            text: `🚫 *تم حظر @${target.split('@')[0]}*\nلن يتمكن من العودة للجروب`,
            mentions: [target]
        }, { quoted: m });
    }

    // ===== فك الحظر =====
    if (command === 'unban' || command === 'فك_حظر') {
        if (!target) return m.reply('*منشن العضو*');

        if (!isInList(g.banned, target)) return conn.sendMessage(m.chat, {
            text: `*❌ @${target.split('@')[0]} غير محظور*`, mentions: [target]
        });

        g.banned = removeFromList(g.banned, target);

        return conn.sendMessage(m.chat, {
            text: `✅ *تم فك حظر @${target.split('@')[0]}*`, mentions: [target]
        }, { quoted: m });
    }

    // ===== قائمة المحظورين =====
    if (command === 'المحظورين' || command === 'banned') {
        const list = g.banned || [];
        if (!list.length) return m.reply('*✅ لا يوجد محظورين*');
        return conn.sendMessage(m.chat, {
            text: `🚫 *المحظورين (${list.length}):*\n\n` +
                  list.map((id, i) => `${i+1}. @${id.split('@')[0]}`).join('\n'),
            mentions: list
        }, { quoted: m });
    }
};

// ===== before hook: بيطرد المحظور لو دخل تاني =====
handler.before = async (m, { conn, bot }) => {
    if (!m.isGroup) return false;
    const g = global._gs?.[m.chat];
    if (!g?.banned?.length) return false;
    if (isOwnerFn(m.sender, bot, conn)) return false;

    // بيقارن بالرقم مش exact match
    if (!isInList(g.banned, m.sender)) return false;

    if (!m.isBotAdmin) return false;

    try {
        const res = await updateParticipant(m.chat, m.sender, 'remove', conn);
        if (res.ok) {
            await conn.sendMessage(m.chat, {
                text: `🚫 تم إزالة @${m.sender.split('@')[0]} تلقائياً (محظور)`,
                mentions: [m.sender]
            });
        }
    } catch {}
    return true;
};

handler.command  = ['ban', 'unban', 'حظر', 'فك_حظر', 'المحظورين', 'banned'];
handler.usage    = ['ban @user', 'unban @user'];
handler.category = 'protection';
export default handler;
