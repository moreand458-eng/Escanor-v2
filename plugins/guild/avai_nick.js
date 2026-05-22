const handler = async (m, { text }) => {
    if (!text) return m.reply('✏️ اكتب اللقب: .متوفر لقب');
    
    const data = global.db.group?.[m.chat]?.nicknames;
    if (!data) return m.reply('🫯 اللقب متوفر');
    
    const exists = Object.values(data).includes(text.trim());
    m.reply(exists ? `🍂| اللقب "${text}" محجوز` : `🫯| اللقب "${text}" متوفر`);
};

handler.command = ["متوفر"];
handler.group = true;
handler.usage =  ["متوفر"];
handler.category = "nicknames";
handler.admin = true;
export default handler;