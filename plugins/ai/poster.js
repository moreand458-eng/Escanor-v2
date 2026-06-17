/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

const الأنواع = ['event', 'movie', 'motivational', 'sale', 'festival', 'birthday', 'custom'];
const الأساليب = ['minimal', 'bold', 'vintage', 'realistic', 'cartoon'];

async function إنشاء_بوستر(برومبت, نص = '', نوع = 'custom', أسلوب = 'minimal') {
    const res = await axios.post('https://app.signpanda.me/seo_tools/ai_poster_generator', {
        prompt: برومبت,
        poster_type: نوع,
        style: أسلوب,
        overlay_text: نص
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://www.appointo.me',
            'Referer': 'https://www.appointo.me/',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36'
        },
        timeout: 60000
    });
    return res.data;
}

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(
            `*🎨 إنشاء بوستر بالذكاء الاصطناعي*\n${'━'.repeat(30)}\n\n` +
            `*الاستخدام:*\n.${command} برومبت | نص | نوع | أسلوب\n\n` +
            `*مثال:*\n.${command} كتاب يعلم البرمجة | Learn To Code | sale | realistic\n\n` +
            `*الأنواع:* ${الأنواع.join(', ')}\n` +
            `*الأساليب:* ${الأساليب.join(', ')}\n\n` +
            `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        );
    }

    m.react('⏳');
    try {
        const أجزاء = text.split('|').map(v => v.trim());
        const برومبت = أجزاء[0];
        const نص_فوق = أجزاء[1] || '';
        const نوع = الأنواع.includes(أجزاء[2]) ? أجزاء[2] : 'custom';
        const أسلوب = الأساليب.includes(أجزاء[3]) ? أجزاء[3] : 'minimal';

        const ناتج = await إنشاء_بوستر(برومبت, نص_فوق, نوع, أسلوب);
        const رابط = ناتج?.image_url || ناتج?.url || ناتج?.result;
        if (!رابط) throw new Error('ما رجع رابط من السيرفر');

        const img = await axios.get(رابط, { responseType: 'arraybuffer', timeout: 30000 });

        await conn.sendMessage(m.chat, {
            image: Buffer.from(img.data),
            caption: `🎨 *بوستر جاهز*\n📝 ${برومبت}\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل الإنشاء:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['بوستر'];
handler.command = ['بوستر', 'poster', 'aipost'];
handler.category = 'ai';

export default handler;
