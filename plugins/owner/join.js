const handler = async (m, { conn, text, bot }) => {
  if (!m.isOwner) {
    const ownerJid = bot?.config?.owners[0]?.jid;
    m.reply("` • تم ارسال طلبك لـ المطور • `");
    await conn.sendMessage(ownerJid, { 
      text: `🔔 *طلب دخول جروب*\nمن: @${m.sender.split("@")[0]}\nالرابط: ${text || "لم يرسل رابط"}`, 
      mentions: [m.sender] 
    });
    return m.reply("✅ تم إرسال طلبك للمطور");
  }

  if (!text) return m.reply("❌ أرسل رابط جروب واتساب");
  if (!text.includes("https://chat.whatsapp.com/")) return m.reply("❌ رابط واتساب فقط");

  m.react("📂");

  try {
    // استخراج الكود من الرابط
    const code = text.split("https://chat.whatsapp.com/")[1]?.trim();
    if (!code) return m.reply("❌ رابط غير صحيح");

    await conn.groupAcceptInvite(code);
    m.reply("✅ تم الدخول للجروب");
  } catch (e) {
    m.react("❌");
    m.reply(`❌ فشل الدخول: ${e.message}`);
  }
};

handler.usage = ["انضم"];
handler.category = "group";
handler.command = ["انضم", "ادخل"];

export default handler;
