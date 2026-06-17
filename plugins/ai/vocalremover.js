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

async function فصل_صوت(buffer) {
    const base64 = buffer.toString('base64');

    const res = await axios.post(
        'https://api.deepai.org/api/torch-srgan',
        { audio: `data:audio/mpeg;base64,${base64}` },
        {
            headers: {
                'Api-Key': 'quickstart-QUdJIGlzIGF3ZXNvbWU',
                'Content-Type': 'application/json'
            },
            timeout: 120000
        }
    );

    // بديل: lalal.ai API
    const form = new FormData();
    form.append('audio_file', buffer, { filename: 'audio.mp3', contentType: 'audio/mpeg' });
    form.append('filter', '1');

    const res2 = await axios.post('https://www.lalal.ai/api/upload/', form, {
        headers: {
            ...form.getHeaders(),
            'Authorization': 'license free',
            'User-Agent': 'Mozilla/5.0'
        },
        timeout: 60000
    });

    if (res2.data?.id) {
        const job_id = res2.data.id;
        await new Promise(r => setTimeout(r, 5000));

        const check = await axios.post('https://www.lalal.ai/api/check/', { id: job_id }, {
            headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
            timeout: 30000
        });

        const result = check.data?.result?.[job_id];
        return {
            vocals: result?.stem?.vocals?.url,
            music: result?.stem?.accomp?.url
        };
    }
    throw new Error('فشل فصل الصوت');
}

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime.includes('audio') && !mime.includes('video')) {
        return m.reply('*❌ رد على ملف صوت أو فيديو عشان أفصل الصوت عن الموسيقى*');
    }

    m.react('⏳');
    await m.reply('*⏳ جاري فصل الصوت... قد يأخذ دقيقة*');
    try {
        const buffer = await q.download();
        const ناتج = await فصل_صوت(buffer);

        if (ناتج?.vocals) {
            const v = await axios.get(ناتج.vocals, { responseType: 'arraybuffer', timeout: 60000 });
            await conn.sendMessage(m.chat, {
                audio: Buffer.from(v.data), mimetype: 'audio/mpeg', ptt: false,
                fileName: 'vocals.mp3'
            }, { quoted: m });
        }
        if (ناتج?.music) {
            const mu = await axios.get(ناتج.music, { responseType: 'arraybuffer', timeout: 60000 });
            await conn.sendMessage(m.chat, {
                audio: Buffer.from(mu.data), mimetype: 'audio/mpeg', ptt: false,
                fileName: 'instrumental.mp3'
            }, { quoted: m });
        }

        await conn.sendMessage(m.chat, {
            text: '✅ *تم فصل الصوت بنجاح*\n🎤 الصوت الأول: الصوت البشري\n🎶 الصوت الثاني: الموسيقى\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*'
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل الفصل:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['فصل_صوت'];
handler.command = ['فصل_صوت2', 'vocalremover2', 'فصل-صوت2'];
handler.category = 'ai';

export default handler;
