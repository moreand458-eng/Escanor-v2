const handler = async (m, { conn, bot }) => {
  let targetLid = m.mentionedJid?.[0] || m.quoted?.sender;
  let targetJid = m.lid2jid(m.mentionedJid?.[0] || m.quoted?.sender)
   if (!targetJid || !targetLid) {
    return m.reply('⚠️ *يرجى منشن الشخص أو الرد على رسالته* ⚠️');
  }
  const user = (await conn.groupMetadata(m.chat)).participants.find(
            p => p.id === targetLid || 
                 p.id === m.sender ||
                 p.phoneNumber === targetJid
        );
  await bot.config.owners.push({
       name: "Owner",
       jid: user.phoneNumber,
       lid: user.id
      })
   m.reply("📂: تم اضافة مطور جديد")
};

handler.usage = ["اضافه-مطور"];
handler.category = "owner";
handler.command = ["ضيف_مطور", "اضافه_مطور"];
handler.owner = true;

export default handler;