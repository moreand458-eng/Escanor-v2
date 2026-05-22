const handler = async (m, { conn, text }) => {
    const data = global.db.group?.[m.chat]?.nicknames;
    if (!data) return m.reply('❌ لا يوجد ألقاب');
    
    const mentioned = await m.lid2jid(m.mentionedJid?.[0]);
    let jid = mentioned;
    let nick = mentioned ? data[mentioned] : null;
    
    if (!jid && text) {
        const entry = Object.entries(data).find(([_, n]) => n === text);
        if (entry) [jid, nick] = entry;
    }
    
    if (!jid || (mentioned && !nick)) return m.reply('❌ ما لقيتش');
    
    delete data[jid];
    m.reply(mentioned ? `🗑️ تم حذف لقب @${jid.split('@')[0]}` : `🗑️ تم حذف "${nick}"`, mentioned ? { mentions: [jid] } : null);
};

handler.command = ["حذف_لقب"];
handler.usage =  ["حذف_لقب"];
handler.category = "nicknames";
handler.admin = true;
handler.group = true;
export default handler;