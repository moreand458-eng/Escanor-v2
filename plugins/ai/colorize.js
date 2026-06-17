/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';
import FormData from 'form-data';

async function تلوين_صورة(buffer) {
    const base64 = buffer.toString('base64');

    const res = await axios.post(
        'https://api.deepai.org/api/colorizer',
        { image: `data:image/jpeg;base64,${base64}` },
        {
            headers: {
                'Api-Key': 'quickstart-QUdJIGlzIGF3ZXNvbWU',
                'Content-Type': 'application/json'
            },
            timeout: 60000
        }
    );

    const رابط = res.data?.output_url;
    if (!رابط) throw new Error('ما رجعت نتيجة');

    const img = await axios.get(رابط, { responseType: 'arraybuffer', timeout: 30000 });
    return Buffer.from(img.data);
}

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image')) return m.reply('*❌ رد على صورة بالأبيض والأسود عشان أضيف لها ألوان*');

    m.react('⏳');
    await m.reply('*⏳ جاري تلوين الصورة...*');
    try {
        const buffer = await q.download();
        const ناتج = await تلوين_صورة(buffer);
        await conn.sendMessage(m.chat, {
            image: ناتج,
            caption: '🎨 *تم تلوين الصورة بالذكاء الاصطناعي*\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*'
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل التلوين:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['تلوين'];
handler.command = ['تلوين', 'colorize', 'لون_صورة'];
handler.category = 'ai';

export default handler;
