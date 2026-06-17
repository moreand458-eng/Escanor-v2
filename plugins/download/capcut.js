import axios from 'axios';

async function تحميل_كاب_كت(رابط) {
    const res = await axios.post(
        'https://capcut.com/api-url-download/',
        { url: رابط },
        {
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'Referer': 'https://www.capcut.com/'
            },
            timeout: 30000
        }
    ).catch(() => null);

    // API بديلة
    const res2 = await axios.get(`https://ssstik.io/en/capcut-downloader`, {
        params: { url: رابط }
    }).catch(() => null);

    // نجرب API ثالثة موثوقة
    const res3 = await axios.get(`https://api.tikmate.app/api/lookup`, {
        params: { url: رابط, is_capcut: 1 },
        headers: {
            'User-Agent': 'Mozilla/5.0',
            'Referer': 'https://tikmate.app/'
        },
        timeout: 30000
    });

    if (res3?.data) {
        return {
            عنوان: res3.data.title || 'CapCut Video',
            رابط_فيديو: res3.data.video || res3.data.download_url,
            رابط_صورة: res3.data.thumbnail
        };
    }

    throw new Error('ما قدرت أجيب الفيديو');
}

const handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply('*❌ حط رابط كاب كت بعد الأمر*\n\nمثال: .كاب_كت https://www.capcut.com/...');
    }

    if (!text.includes('capcut.com') && !text.includes('capcut.link')) {
        return m.reply('*❌ الرابط مش من كاب كت*');
    }

    m.react('⏳');
    try {
        const ناتج = await تحميل_كاب_كت(text.trim());

        const res = await axios.get(ناتج.رابط_فيديو, {
            responseType: 'arraybuffer',
            timeout: 120000
        });

        await conn.sendMessage(m.chat, {
            video: Buffer.from(res.data),
            caption: `🎬 *${ناتج.عنوان}*\n\n> تم التحميل من كاب كت`,
            mimetype: 'video/mp4'
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل التحميل:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['كاب_كت'];
handler.command = ['كاب_كت', 'capcut', 'كابكت'];
handler.category = 'downloads';

export default handler;
