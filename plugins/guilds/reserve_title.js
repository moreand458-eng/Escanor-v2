const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*مثال:* .حجز_لقب اللقب');
    const title = text.trim().toLowerCase();

    if (!global._reservedTitles) global._reservedTitles = {};
    const existing = global._reservedTitles[title];
    if (existing && existing !== m.sender) {
        return conn.sendMessage(m.chat, {
            text: `*❌ اللقب "${text}" محجوز لـ @${existing.split('@')[0]} بالفعل*`,
            mentions: [existing]
        }, { quoted: m });
    }
    if (existing === m.sender) return m.reply('*❌ أنت حاجزه بالفعل*');

    // تحقق إن المستخدم مش عنده حجز قبل
    const myReserved = Object.entries(global._reservedTitles).find(([, v]) => v === m.sender);
    if (myReserved) return m.reply(`*❌ عندك لقب محجوز بالفعل: "${myReserved[0]}"*\nاستخدم *.الغاء_حجز* أولاً`);

    global._reservedTitles[title] = m.sender;
    await m.reply(`✅ *تم حجز اللقب "${text}" بنجاحك*\n\n> لتعيينه: *.تلقيب @شخص ${text}*`);
};

handler.command  = ['حجز_لقب'];
handler.usage    = ['حجز_لقب'];
handler.category = 'guilds';
export default handler;
