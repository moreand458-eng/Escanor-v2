import { createSticker } from "../../system/utils.js";

const test = async (m, { conn, args }) => {
  if (!m.quoted) return m.reply("❤️ ~ يرجى الرد على ملصق ~ 💙");

  if (!args.length) {
    return m.reply("📝 *الاستخدام الصحيح:*\n\n.حقوق اسم الباك | اسم المؤلف\n\n*مثال:*\n`.حقوق 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 | 2025`");
  }

  const full = args.join(" ");
  const parts = full.split("|");

  let pack = (parts[0] || "𝐄𝐒").trim() || "𝐄𝐒";
  let author = parts[1] !== undefined ? parts[1].trim() : null;

  const q = await m.quoted;

  if (!q || !q.mimetype) return m.reply("❌ تعذّر قراءة الملصق، تأكد أنك رددت على ملصق صحيح.");

  const buffer = await createSticker(await q.download(), { mime: q.mimetype, pack, author });

  await conn.sendMessage(
    m.chat,
    { sticker: buffer, contextInfo: context(m.sender, "https://i.postimg.cc/RFqPQkhZ/8653766a329a5a5a714e221e9aa67e3a.jpg") },
    { quoted: global.reply_status || m }
  );
};

test.usage = ["حقوق نص | نص"];
test.command = ["حقوق"];
test.category = "sticker";
export default test;

const context = (jid, img) => ({
  mentionedJid: [jid],
  isForwarded: true,
  forwardingScore: 1,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363422581600030@newsletter',
    newsletterName: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
    serverMessageId: 0
  },
  externalAdReply: {
    title: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻👨🏻‍💻🔥 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐄𝐒/𝐄𝐒𝐂 𝐟𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
    body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚒𝚜 𝚎𝚊𝚜𝚢 𝚝𝚘 𝚖𝚘𝚍𝚒𝚏𝚢 𝚊𝚗𝚍 𝚟𝚎𝚛𝚢 𝚏𝚊𝚜𝚝",
    thumbnailUrl: img,
    sourceUrl: '',
    mediaType: 1,
    renderLargerThumbnail: true
  }
});
