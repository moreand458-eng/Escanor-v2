const GEMINI_API_KEY = "AIzaSyAapx0RK6kMjIpAbdQxHtL5qS7ldrM7SGk";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const handler = async (m, { conn, text, bot }) => {
  if (!text) return m.reply("🤖 ~ حط سؤالك أو رسالتك جنب الأمر ~\n\nمثال: .جيميناي من أنت؟");

  const loadingMsg = await conn.sendMessage(m.chat, {
    text: "```⏳ جـاري تـجـهـيـز الـرد...```",
    contextInfo: context(m.sender)
  }, { quoted: m });

  try {
    const res = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `أنت مساعد ذكي اسمك جيميناي، تتكلم بالعربية بشكل طبيعي وتساعد المستخدم في أي شيء.\nرد على: ${text}` }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      })
    });

    const data = await res.json();

    if (data?.error) {
      throw new Error(data.error.message || "خطأ من API");
    }

    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!answer) throw new Error("لم يرجع رد");

    await conn.sendMessage(m.chat, {
      text: answer,
      edit: loadingMsg.key,
      contextInfo: context(m.sender)
    });

  } catch (e) {
    await conn.sendMessage(m.chat, {
      text: `*❌ حصل خطأ:* ${e.message}`,
      edit: loadingMsg.key,
      contextInfo: context(m.sender)
    });
  }
};

handler.usage = ["جيميناي"];
handler.category = "ai";
handler.command = ["جيميناي", "gemini", "جيمناي"];

export default handler;

const context = (jid) => ({
  mentionedJid: [jid],
  isForwarded: true,
  forwardingScore: 1,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363422581600030@newsletter',
    newsletterName: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
    serverMessageId: 0
  },
  externalAdReply: {
    title: "🤖 Gemini AI | جيميناي",
    body: "𝙶𝚘𝚘𝚐𝚕𝚎 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙸 ~ 𝙴𝚜𝚌𝚊𝚗𝚘𝚛 𝙱𝚘𝚝",
    thumbnailUrl: "https://i.postimg.cc/NMLN73FQ/328bf8cccafe63879d903f2b99d835a0.jpg",
    sourceUrl: '',
    mediaType: 1,
    renderLargerThumbnail: true
  }
});
