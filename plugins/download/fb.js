const handler = async (m, { conn, text, command }) => {
    if (!text) return m.reply(`*❲ ❤️ ❳ ~ ضع رابط الفيديو بعد الأمر*\nمثال: .${command} https://www.facebook.com/reel/xxx`);
    m.react('🌾');

    try {
        const res = await fetch(`https://fsaver.net/download/?url=${encodeURIComponent(text)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',
                'Upgrade-Insecure-Requests': '1'
            },
            signal: AbortSignal.timeout(15000)
        });
        const html = await res.text();
        const match = html.match(/class="video__item"[^>]*src="([^"]+)"/);
        if (!match) throw new Error('ما قدرت أجيب الفيديو، تأكد من الرابط');

        const videoUrl = 'https://fsaver.net' + match[1];
        const fileRes = await fetch(videoUrl, { signal: AbortSignal.timeout(60000) });
        const buffer = Buffer.from(await fileRes.arrayBuffer());
        await conn.sendMessage(m.chat, {
            video: buffer, caption: `> *تم بواسطة ~ ${m.pushName}*`, mimetype: 'video/mp4'
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل التحميل:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['فيس'];
handler.category = 'downloads';
handler.command = /^(فيس|فيسبوك|fb|fbdl|facebook)$/i;
export default handler;
