import axios from 'axios';

// النماذج المجانية فقط في Pollinations
const نماذج_مجانية = ['flux', 'turbo', 'flux-realism', 'flux-anime'];

async function توليد_صورة(وصف, نموذج = 'flux') {
    // نضمن إن النموذج مجاني
    if (!نماذج_مجانية.includes(نموذج)) نموذج = 'flux';

    for (let محاولة = 0; محاولة < 3; محاولة++) {
        try {
            const seed = Math.floor(Math.random() * 99999);
            const رابط = `https://image.pollinations.ai/prompt/${encodeURIComponent(وصف)}?model=${نموذج}&width=1024&height=1024&seed=${seed}&nologo=true&nofeed=true`;

            const res = await axios.get(رابط, {
                responseType: 'arraybuffer',
                timeout: 120000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
                }
            });

            return Buffer.from(res.data);
        } catch (e) {
            if (e.response?.status === 402 || e.response?.status === 429) {
                // جرب نموذج تاني
                const index = نماذج_مجانية.indexOf(نموذج);
                نموذج = نماذج_مجانية[(index + 1) % نماذج_مجانية.length];
                await new Promise(r => setTimeout(r, 2000));
                continue;
            }
            throw e;
        }
    }
    throw new Error('فشل توليد الصورة بعد عدة محاولات');
}

const نماذج_عرض = {
    'flux': 'Flux (افتراضي) ✅',
    'flux-realism': 'Flux واقعي ✅',
    'flux-anime': 'Flux أنمي ✅',
    'turbo': 'سريع ✅'
};

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(
            `*🎨 توليد صور بالذكاء الاصطناعي*\n\n` +
            `*الاستخدام:*\n` +
            `• .${command} a beautiful sunset over the sea\n` +
            `• .${command} anime girl with sword\n\n` +
            `*النماذج المتاحة:*\n` +
            Object.entries(نماذج_عرض).map(([k, v]) => `• ${k} ← ${v}`).join('\n') +
            `\n\n*مثال مع نموذج:* .${command} anime girl | flux-anime`
        );
    }

    m.react('🎨');
    await m.reply('*⏳ جاري توليد الصورة...*');

    try {
        let وصف = text;
        let نموذج_مختار = 'flux';

        if (text.includes('|')) {
            const أجزاء = text.split('|');
            وصف = أجزاء[0].trim();
            const مطلوب = أجزاء[1].trim().toLowerCase();
            if (نماذج_مجانية.includes(مطلوب)) نموذج_مختار = مطلوب;
        }

        const buffer = await توليد_صورة(وصف, نموذج_مختار);

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `🎨 *صورة بالذكاء الاصطناعي*\n📝 ${وصف.slice(0, 100)}\n🤖 نموذج: ${نموذج_مختار}`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل توليد الصورة:*\n${e.message?.slice(0, 150)}`);
    }
};

handler.usage = ['توليد_صورة'];
handler.command = ['توليد_صورة', 'imagine', 'aiimg', 'ايميج', 'صورة_ذكاء'];
handler.category = 'ai';

export default handler;
