const getInstagram = async (url) => {
    const data = new URLSearchParams({
        q: url,
        t: 'media',
        lang: 'en',
        v: '26307'
    });
    const res = await fetch('https://v3.igdownloader.app/api/ajaxSearch', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'Mozilla/5.0 (Android 15; Mobile)',
            'origin': 'https://igdownloader.app',
            'referer': 'https://igdownloader.app/'
        },
        body: data,
        signal: AbortSignal.timeout(15000)
    });
    return res.json();
};

const handler = async (m, { conn, text }) => {
    if (!text || !text.includes('instagram.com')) return m.reply('*❌ حط رابط إنستقرام صحيح جنب الأمر*');
    m.react('⏳');

    try {
        const result = await getInstagram(text);
        if (!result?.data) throw new Error('ما قدرت أجيب الميديا');

        const html = result.data;
        const urls = [...html.matchAll(/href="(https:\/\/[^"]*(?:\.mp4|\.jpg|cdninstagram[^"]*))"/g)]
            .map(m => m[1]);

        if (!urls.length) throw new Error('مفيش ميديا في الرابط ده');

        for (const url of urls.slice(0, 3)) {
            const fileRes = await fetch(url, { signal: AbortSignal.timeout(60000) });
            const buffer = Buffer.from(await fileRes.arrayBuffer());
            const isVideo = url.includes('.mp4') || url.includes('video');
            await conn.sendMessage(m.chat,
                isVideo
                    ? { video: buffer, caption: '📥 Instagram', mimetype: 'video/mp4' }
                    : { image: buffer, caption: '📷 Instagram' },
                { quoted: m }
            );
        }
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل التحميل:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['انستا'];
handler.category = 'downloads';
handler.command = ['انستا', 'instagram', 'ig'];
export default handler;
