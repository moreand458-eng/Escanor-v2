const handler = async (m, { conn, command, text }) => {
    if (!global._reservedTitles) global._reservedTitles = {};

    if (command === 'الالقاب_المحجوزه') {
        const list = Object.entries(global._reservedTitles);
        if (!list.length) return m.reply('*📋 لا توجد ألقاب محجوزة*');
        const text2 = list.map(([t, id], i) =>
            `${i+1}. *${t}* → @${id.split('@')[0]}`
        ).join('\n');
        return conn.sendMessage(m.chat, {
            text: `🏰 *الألقاب المحجوزة (${list.length}):*\n\n${text2}`,
            mentions: list.map(([, id]) => id)
        }, { quoted: m });
    }

    if (command === 'الغاء_حجز') {
        const myTitle = Object.entries(global._reservedTitles).find(([, v]) => v === m.sender);
        if (!myTitle) return m.reply('*❌ ليس لديك لقب محجوز*');
        delete global._reservedTitles[myTitle[0]];
        return m.reply(`✅ *تم إلغاء حجز اللقب "${myTitle[0]}"*`);
    }

    if (command === 'متوفر') {
        const title = text?.trim()?.toLowerCase();
        if (!title) return m.reply('*مثال:* .متوفر اسم_اللقب');
        const isReserved = !!global._reservedTitles[title];
        return m.reply(isReserved
            ? `*❌ اللقب "${text}" محجوز*`
            : `*✅ اللقب "${text}" متوفر*`
        );
    }
};

handler.command  = ['الالقاب_المحجوزه', 'الغاء_حجز', 'متوفر'];
handler.usage    = ['الالقاب_المحجوزه', 'الغاء_حجز', 'متوفر'];
handler.category = 'guilds';
export default handler;
