/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function صورة_لفيديو(buffer, وصف = '') {
    const base64 = buffer.toString('base64');

    // نستخدم Stability AI stable-video-diffusion
    const res = await axios.post(
        'https://api.stability.ai/v2beta/image-to-video',
        {
            image: `data:image/jpeg;base64,${base64}`,
            seed: Math.floor(Math.random() * 99999),
            cfg_scale: 1.8,
            motion_bucket_id: 127
        },
        {
            headers: {
                Authorization: 'Bearer sk-free',
                'Content-Type': 'application/json'
            },
            timeout: 30000
        }
    ).catch(() => null);

    // API بديلة: Segmind
    const res2 = await axios.post(
        'https://api.segmind.com/v1/stable-video-diffusion',
        { image: `data:image/jpeg;base64,${base64}`, fps: 10, num_frames: 25 },
        {
            headers: {
                'x-api-key': 'SG_free_tier',
                'Content-Type': 'application/json'
            },
            timeout: 120000
        }
    );

    if (res2.data?.video) {
        return Buffer.from(res2.data.video, 'base64');
    }
    if (res2.data?.output) {
        const v = await axios.get(res2.data.output, { responseType: 'arraybuffer', timeout: 60000 });
        return Buffer.from(v.data);
    }
    throw new Error('فشل تحويل الصورة لفيديو');
}

const handler = async (m, { conn, text }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime.startsWith('image')) return m.reply('*❌ رد على صورة عشان أحولها لفيديو متحرك*');

    m.react('⏳');
    await m.reply('*⏳ جاري تحويل الصورة لفيديو... قد يأخذ دقيقتين*');
    try {
        const buffer = await q.download();
        const ناتج = await صورة_لفيديو(buffer, text || '');

        await conn.sendMessage(m.chat, {
            video: ناتج,
            mimetype: 'video/mp4',
            caption: '✨ *تم تحويل الصورة لفيديو بالذكاء الاصطناعي*\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*'
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل التحويل:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['صورة_لفيديو'];
handler.command = ['صورة_لفيديو', 'img2video', 'صورة-فيديو'];
handler.category = 'ai';

export default handler;
