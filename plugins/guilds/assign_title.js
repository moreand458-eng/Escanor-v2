// تلقيب - تعيين لقب لعضو
const getU = (id) => {
    if (!global._userData) global._userData = {};
    if (!global._userData[id]) global._userData[id] = {};
    return global._userData[id];
};

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*مثال:* .تلقيب @شخص اسم_اللقب');

    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply('*منشن الشخص أو رد على رسالته*');

    const titleName = text.replace(/@\d+/, '').trim();
    if (!titleName) return m.reply('*اكتب اسم اللقب*');

    // تحقق إن اللقب غير محجوز بشخص آخر
    const reservedTitles = global._reservedTitles || {};
    if (reservedTitles[titleName.toLowerCase()] && reservedTitles[titleName.toLowerCase()] !== target) {
        return conn.sendMessage(m.chat, {
            text: `*❌ اللقب "${titleName}" محجوز لشخص آخر*`,
            mentions: [target]
        });
    }

    const ud = getU(target);
    ud.title = titleName;

    await conn.sendMessage(m.chat, {
        text:
            `🏆 *تم تعيين اللقب بنجاح*\n\n` +
            `👤 @${target.split('@')[0]}\n` +
            `🏰 اللقب: *${titleName}*`,
        mentions: [target]
    }, { quoted: m });
};

handler.command  = ['تلقيب'];
handler.usage    = ['تلقيب'];
handler.admin    = true;
handler.category = 'guilds';
export default handler;
