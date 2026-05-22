const handler = async (m, { conn, command, text }) => {
  if (!text) return m.reply('*❲ ❤️ ❳ ~ حط رابط يوتيوب جنب الامر ~ ❲ 💙 ❳*');

  if (!text.match(/youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\//)) {
    return m.reply('*❌ ~ الرابط مش صحيح ~ حط رابط يوتيوب صحيح*');
  }

  const isAudio = command === "يوت_اغنيه" || command === "ytmp3";

  m.react("⏳");

  const getVideoId = (url) => {
    const match = url.match(/(?:v=|youtu\.be\/|shorts\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(text);
  if (!videoId) return m.reply('*❌ مش قادر استخرج ID من الرابط*');

  let title = 'بدون عنوان';
  let author = 'غير معروف';
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  try {
    const infoRes = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    const info = await infoRes.json();
    title = info?.title || title;
    author = info?.author_name || author;
  } catch {}

  try {
    const apiUrl = isAudio
      ? `https://api.agatz.xyz/api/ytmp3?url=${encodeURIComponent(text)}`
      : `https://api.agatz.xyz/api/ytmp4?url=${encodeURIComponent(text)}`;

    const apiRes = await fetch(apiUrl);
    const data = await apiRes.json();
    const downloadUrl = data?.data?.downloadUrl || data?.data?.url || data?.url;

    if (!downloadUrl) return m.reply('*❌ فشل في جلب رابط التحميل، جرب تاني بعد شوية*');

    const type = isAudio ? 'اغـانـي 🎵' : 'فيـديـوز 🎬';
    const caption = `*🐞 YouTube | يـوتـيـوب ${type}*\n\n` +
      `╭─┈─┈─┈─⟞🍧⟝─┈─┈─┈─╮\n` +
      `*❲ 📽️ ❳ الـعـنـوان:* ${title}\n` +
      `*❲ 📢 ❳ الـقـنـاة:* ${author}\n` +
      `╰─┈─┈─┈─⟞🍬⟝─┈─┈─┈─╯\n` +
      `> _*❲ ⏱️ ❳ الرجاء الانتظار قليلاً...*_`;

    await conn.sendMessage(m.chat, {
      text: caption,
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 1,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363422581600030@newsletter',
          newsletterName: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
          serverMessageId: 0
        },
        externalAdReply: {
          title,
          body: author,
          thumbnailUrl: thumbnail,
          sourceUrl: '',
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });

    await conn.sendMessage(m.chat,
      isAudio ? {
        audio: { url: downloadUrl },
        mimetype: 'audio/mpeg',
        fileName: `${title}.mp3`
      } : {
        video: { url: downloadUrl },
        caption: `*${title}*`
      },
      { quoted: m }
    );

    m.react("✅");

  } catch (e) {
    m.react("❌");
    await m.reply(`*❌ حصل خطأ:* ${e.message}`);
  }
};

handler.usage = ["يوتيوب", "يوت_اغنيه"];
handler.category = "downloads";
handler.command = ['يوت_اغنيه', 'يوتيوب', 'ytmp3', 'ytmp4'];

export default handler;
