import { Scrapy } from "esewsub";

const handler = async (m, { conn, text, bot }) => {
  if (!text) return m.reply("🔴 ~ حط نص جنب الأمر ~ 🎪");

  const loadingMsg = await conn.sendMessage(m.chat, {
    contextInfo: context(m.sender, "https://i.postimg.cc/tgBS6qXM/37cdb10ebaf3f7c14269409c9e8af435.jpg"),
    text: "```⏳ جـاري تـجـهـيـز الـرد يـا صـديـقـي,...```"
  }, { quoted: m});

  const prompt = `
انت بوت واتساب بـ اسم [إسكانور، Escanor] تجسيد لـ شخصية إسكانور من انمي [The Seven Deadly Sins] وتكلم بـ لجهة مصرية
طريقة كلامك: هادئة، عاقلة، بتفكر قبل ما تتكلم، متزنة، بتحلل الموقف، بتدي نصائح عملية، صوتك واطي ومطمن
و انا اسمي هيكون [ ${m.name || "مز"} ] 
رد علي رسالتي دي:
${text}
`;

  const { data: res } = await Scrapy.ZeroAI(text, prompt);

  await conn.sendMessage(m.chat, {
    text: res.answer,
    edit: loadingMsg.key,
    contextInfo: context(m.sender, "https://i.postimg.cc/MG9PB6WL/0c073086ee93797b4b3d109dab7a822c.jpg")
  });
};

handler.usage = ["إسكانور"];
handler.category = "ai";
handler.command = ["إسكانور", "Escanor"];

export default handler;

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363422581600030@newsletter',
        newsletterName: '𝐄𝐒𝐂𝐀𝐍𝛩𝐑 ~ 𝐂𝐢𝐫𝐜𝐮𝐬 ⚜️',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "The Seven Deadly Sins 🎭",
        body: "𝚃𝚊𝚔𝚎 𝚊 𝚍𝚎𝚎𝚙 𝚋𝚛𝚎𝚊𝚝𝚑 ~ ☆ 𝙻𝚎𝚝'𝚜 𝚝𝚑𝚒𝚗𝚔 𝚝𝚘𝚐𝚎𝚝𝚑𝚎𝚛",
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});