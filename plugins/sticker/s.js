import { createSticker } from "../../system/utils.js";

const test = async (m, { conn, bot }) => {
  if (!m.quoted) return m.reply("❤️ ~ يرجى الرد على صورة أو فيديو لتحويله إلى ملصق ~ 💙");

  const { pack, author } = bot.config.info.copyright;
  const q = await m.quoted;

  if (!q || !q.mimetype) return m.reply("❌ تعذّر قراءة الميديا، تأكد أنك رددت على صورة أو فيديو صحيح.");

  const buffer = await createSticker(await q.download(), { mime: q.mimetype, pack, author });

  await conn.sendMessage(
    m.chat,
    { sticker: buffer },
    { quoted: global.reply_status || m }
  );
};

test.usage = ["ملصق"];
test.command = ["ملصق", "s"];
test.category = "sticker";
export default test;
