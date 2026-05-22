const handler = async (m, { conn }) => {
    const data = global.db.group?.[m.chat]?.nicknames;
    if (!data || Object.keys(data).length === 0) return m.reply('📭 لا يوجد ألقاب مسجلة');
    
    let list = '📋 — *الألقاب المسجلة:*\n\n';
    let index = 1;
    for (let [jid, nick] of Object.entries(data)) {
        list += `${index}. 👾 ${jid.split('@')[0]} ≤ ${nick} ≥\n`;
        index++;
    }
    
    await conn.sendMessage(m.chat, { text: list, mentions: Object.keys(data) });
};

handler.command = ["الألقاب"];
handler.usage =  ["الألقاب"];
handler.category = "nicknames";
handler.admin = true;
handler.group = true;
export default handler;