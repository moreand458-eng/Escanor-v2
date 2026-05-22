const handler = async (m, { conn, bot }) => {

  const isOwner = bot.config.owners.some(o => 
    m.sender === o.jid || m.sender === o.lid
  );

  const replyText = isOwner 
    ? `تم استشعار المطور 👁‍🗨\nالنظام تحت أمرك يا سيد 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 👑⚡`
    : `أنا 𝐄𝐒𝐂𝐀𝐍𝛩𝐑… نادِني باسمي يا هذا ☠️`;

  await conn.sendMessage(m.chat, { text: replyText }, { quoted: m });

};

handler.command = ["بوت"];
handler.usePrefix = false;
handler.disabled = false;

export default handler;