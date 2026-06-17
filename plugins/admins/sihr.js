// سحر - تغيير اسم العضو مؤقتاً بردود مضحكة
const SIHR_MSGS = [
    '🔮 تم تطبيق السحر على @{name}!\nالأعراض: عدم القدرة على الكلام 😂',
    '🪄 @{name} تحول إلى ضفدع! 🐸',
    '✨ @{name} تحت تأثير التعويذة! لا يستطيع التحرك 😈',
    '🌀 @{name} مسحور! انتظر 30 ثانية 🔮',
];
const handler = async (m, { conn }) => {
    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply('*منشن العضو*');
    const msg = SIHR_MSGS[Math.floor(Math.random() * SIHR_MSGS.length)]
        .replace('{name}', target.split('@')[0]);
    await conn.sendMessage(m.chat, { text: msg, mentions: [target] }, { quoted: m });
};
handler.command  = ['سحر'];
handler.usage    = ['سحر'];
handler.admin    = true;
handler.category = 'admins';
export default handler;
