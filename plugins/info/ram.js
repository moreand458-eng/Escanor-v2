import os from 'os';

const handler = async (m, { conn }) => {
  const txt = `
  ⊱⋅ ────────────────── ⋅⊰
🪾╎ الـمسـتـخـدم: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)}MB
🌳╎ الـمتـبــقـي: ${(os.freemem() / 1024 / 1024).toFixed(1)}MB
  ⊱⋅ ────────────────── ⋅⊰
`;

  await conn.msgUrl(m.chat, txt, {
    img: "ttps://i.postimg.cc/76bBMFhk/abaed7d219de0329c61e822329663c4f.jpg" ,
    caption: txt,
    title: "𝐒𝐩𝐞𝐞𝐝 / 𝐓𝐞𝐬𝐭",
    body: "𝐓𝐞𝐬𝐭𝐢𝐧𝐠 𝐭𝐡𝐞 𝐛𝐨𝐭'𝐬 𝐬𝐩𝐞𝐞𝐝: 𝐈𝐬 𝐢𝐭 𝐟𝐚𝐬𝐭 𝐨𝐫 𝐧𝐨𝐭?",
    newsletter: {
      name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
      jid: '120363422581600030@newsletter'
    },
    big: false,
    mentions: [m.sender]
  }, global.reply_status);
};

handler.command = ["الرام", "ram"];
handler.category = "info";
handler.usage = ["الرام", "ram"];
export default handler;