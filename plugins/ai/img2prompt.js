/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image')) return m.reply('*❌ رد على صورة عشان أولد منها برومبت*');

    m.react('⏳');
    try {
        const buffer = await q.download();
        const base64 = buffer.toString('base64');

        const res = await axios.post('https://imageprompt.org/api/ai/prompts/image',
            { base64Url: `data:image/jpeg;base64,${base64}` },
            { headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' }, timeout: 30000 }
        );

        const برومبت = res.data?.prompt || res.data;
        if (!برومبت) throw new Error('ما رجع برومبت');

        await conn.sendMessage(m.chat, {
            text: `*🎨 البرومبت المستخرج من الصورة:*\n\n${برومبت}\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل الاستخراج:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['صورة_لبرومبت'];
handler.command = ['صورة_لبرومبت', 'img2prompt', 'برومبت_صورة'];
handler.category = 'ai';

export default handler;
