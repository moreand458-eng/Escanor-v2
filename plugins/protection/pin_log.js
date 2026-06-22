// تثبيت الرسائل وسجل المخالفات
import { canUseAdminCmd } from '../../system/admin_utils.js';
import { adminGuard, notAuthMsg } from '../../system/bot_protection.js';

const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

const handler = async (m, { conn, command, text, bot }) => {
    if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');

    await adminGuard(m, { conn, bot });
    if (!canUseAdminCmd(m, bot, conn)) return m.reply(notAuthMsg());

    const g = getG(m.chat);

    // تثبيت رسالة
    if (command === 'pin' || command === 'تثبيت') {
        const key = m.quoted?.key || m.key;
        try {
            await conn.sendMessage(m.chat, { pin: { type: 1, time: 86400 }, key });
            return m.reply('📌 *تم تثبيت الرسالة*');
        } catch { return m.reply('*❌ تعذر التثبيت - تأكد إن البوت ادمن*'); }
    }

    // إلغاء تثبيت
    if (command === 'unpin' || command === 'فك_تثبيت') {
        const key = m.quoted?.key || m.key;
        try {
            await conn.sendMessage(m.chat, { pin: { type: 2 }, key });
            return m.reply('📌 *تم إلغاء تثبيت الرسالة*');
        } catch { return m.reply('*❌ تعذر إلغاء التثبيت*'); }
    }

    // تفعيل سجل المخالفات
    if (command === 'log') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on') { g.logMode = true; return m.reply('✅ *تم تفعيل سجل المخالفات*'); }
        if (val === 'off') { delete g.logMode; g.violations = []; return m.reply('✅ *تم إيقاف السجل*'); }
        return m.reply(`السجل: ${g.logMode ? '✅ مفعل' : '❌ مطفي'}\n\n*.log on* أو *.log off*`);
    }

    // عرض السجل
    if (command === 'violations' || command === 'سجل_المخالفات') {
        const log = g.violations || [];
        if (!log.length) return m.reply('*📋 السجل فارغ*');
        const text2 = log.slice(0, 20).map((l, i) => `${i+1}. ${l}`).join('\n');
        return conn.sendMessage(m.chat, {
            text: `📋 *سجل المخالفات:*\n\n${text2}`
        }, { quoted: m });
    }

    // مسح السجل
    if (command === 'clearlog' || command === 'مسح_السجل') {
        g.violations = [];
        return m.reply('✅ *تم مسح السجل*');
    }

    // anti-newcomer
    if (command === 'anti-newcomer') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on') { g.antiNewcomer = true; return m.reply('✅ *تم تفعيل مضاد الحسابات الجديدة*'); }
        if (val === 'off') { delete g.antiNewcomer; return m.reply('✅ *تم إيقاف مضاد الحسابات الجديدة*'); }
        return m.reply(`حالة مضاد الجدد: ${g.antiNewcomer ? '✅ مفعل' : '❌ مطفي'}`);
    }

    // clearbans
    if (command === 'clearbans' || command === 'مسح_الحظر') {
        g.banned = [];
        return m.reply('✅ *تم مسح قائمة المحظورين*');
    }
};

// before hook للسجل
handler.before = async (m, { conn, bot }) => {
    if (!m.isGroup) return false;
    const g = global._gs?.[m.chat];
    if (!g?.logMode) return false;

    const isOwner = bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);
    if (!isOwner && !m.isAdmin) return false; // السجل للمراقبة فقط مش للمنع

    return false; // مش بيمنع، بس بيسجل
};

handler.command  = [
    'pin', 'unpin', 'تثبيت', 'فك_تثبيت',
    'log', 'violations', 'سجل_المخالفات',
    'clearlog', 'مسح_السجل',
    'anti-newcomer', 'clearbans', 'مسح_الحظر'
];
handler.usage    = ['pin', 'unpin', 'log on/off', 'anti-newcomer on/off'];
handler.admin    = true;
handler.category = 'protection';
export default handler;
