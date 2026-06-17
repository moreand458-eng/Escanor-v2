/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function توليد_sdxl(برومبت) {
    const res = await axios({
        method: 'post',
        url: 'https://apiimagen.magiceraser.fyi/imagen_v1',
        params: {
            size: '1080x1920',
            negative_prompt: 'ugly, blurry, bad quality',
            style: null,
            custom_style: null,
            prompt: برومبت,
            version: 'sdxl'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'User-Agent': 'Dalvik/2.1.0',
            'Accept-Encoding': 'gzip'
        },
        responseType: 'arraybuffer',
        timeout: 120000
    });
    return Buffer.from(res.data);
}

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(
            `*🎨 توليد صور SDXL*\n${'━'.repeat(30)}\n\n` +
            `*الاستخدام:*\n.${command} [وصف الصورة]\n\n` +
            `*مثال:*\n.${command} a futuristic city at night, cyberpunk style\n\n` +
            `*ملاحظة:* اكتب الوصف بالإنجليزي للحصول على أفضل نتيجة\n\n` +
            `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        );
    }

    m.react('⏳');
    await m.reply('*⏳ جاري توليد الصورة بنموذج SDXL...*');
    try {
        const buffer = await توليد_sdxl(text);
        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: `🎨 *صورة SDXL*\n📝 ${text.slice(0, 100)}\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل التوليد:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['sdxl'];
handler.command = ['sdxl', 'stable', 'توليد_sdxl'];
handler.category = 'ai';

export default handler;
