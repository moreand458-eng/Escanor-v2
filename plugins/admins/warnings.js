const handler = async (m, { conn }) => {
  const g = db.groups?.[m.chat] || {};
  const w = g.warnings || {};
  const id = m.sender;
  const count = w[id] || 0;

  if (!w[id]) {
    return conn.sendMessage(m.chat, {
      text: `📊 @${id.split("@")[0]} معندكش أي إنذارات`,
      mentions: [id]
    }, { quoted: global.reply_status });
  }

  await conn.sendMessage(m.chat, {
    text: `📊 @${id.split("@")[0]} إنذاراتك: ${count}\n⚠️ عند 3 إنذارات سيتم طردك`,
    mentions: [id]
  }, { quoted: global.reply_status });
};

handler.command = ["انذاراتي", "warns", "warnings", "الانذارات"];
handler.usage = ['الانذارات'];
handler.category = "admin";

export default handler;