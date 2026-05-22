const handler = async (m, { conn, text }) => {
    
    const mentioned = await m.lid2jid(m.mentionedJid?.[0])
    if (!mentioned) return m.reply('🎯 قم بمنشن الشخص: .لقب @user');
    
    const parts = text.split(' ');
    parts.shift();
    const nickname = parts.join(' ').trim();
    
    if (!nickname) return m.reply('✏️ اكتب اللقب بعد المنشن: .لقب @user لقبك');
    
    if (!global.db.group) global.db.group = {};
    if (!global.db.group[m.chat]) global.db.group[m.chat] = {};
    if (!global.db.group[m.chat].nicknames) global.db.group[m.chat].nicknames = {};
    
    const existingNick = Object.entries(global.db.group[m.chat].nicknames).find(([jid, nick]) => 
        nick === nickname && jid !== mentioned
    );
    
    if (existingNick) return m.reply(`🪾 اللقب "${nickname}" محجوز`);
    
    global.db.group[m.chat].nicknames[mentioned] = nickname;
    await conn.sendMessage(m.chat, { text: `✅ تم تسجيل "${nickname}" لـ @${mentioned.split('@')[0]}`, mentions: [mentioned] });
};

handler.command = ["لقب"];
handler.usage =  ["لقب"];
handler.category = "nicknames";
handler.admin = true;
handler.group = true;
export default handler;