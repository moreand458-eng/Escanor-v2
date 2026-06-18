/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

const القراء = {
    '1': { اسم: 'مشاري العفاسي', id: 'ar.alafasy' },
    '2': { اسم: 'عبد الباسط عبد الصمد', id: 'ar.abdulbasitmurattal' },
    '3': { اسم: 'سعد الغامدي', id: 'ar.saoodashuraimalarfani' },
    '4': { اسم: 'ماهر المعيقلي', id: 'ar.mahermuaiqly' },
};

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(
            `*🎙️ تلاوة قرآنية*\n${'━'.repeat(30)}\n\n` +
            `*الاستخدام:*\n.${command} [رقم_السورة]\n.${command} [رقم_السورة] [رقم_القارئ]\n\n` +
            `*مثال:*\n.${command} 36 ← سورة يس بصوت العفاسي\n.${command} 36 2 ← عبد الباسط\n\n` +
            `*القراء:*\n` +
            Object.entries(القراء).map(([k, v]) => `${k}. ${v.اسم}`).join('\n') +
            `\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        );
    }

    const أجزاء = text.trim().split(/\s+/);
    const رقم_سورة = parseInt(أجزاء[0]);
    const رقم_قارئ = أجزاء[1] || '1';

    if (isNaN(رقم_سورة) || رقم_سورة < 1 || رقم_سورة > 114) {
        return m.reply('*❌ رقم السورة غير صحيح (1-114)*');
    }

    const قارئ = القراء[رقم_قارئ] || القراء['1'];

    m.react('⏳');
    try {
        const معلومات = await axios.get(`https://api.alquran.cloud/v1/surah/${رقم_سورة}/${قارئ.id}`, {
            timeout: 15000
        });
        const سورة = معلومات.data?.data;
        if (!سورة) throw new Error('رقم السورة غير صحيح');

        const رابط_صوت = `https://cdn.islamic.network/quran/audio-surah/128/${قارئ.id.split('.')[1]}/${رقم_سورة}.mp3`;

        const صوت = await axios.get(رابط_صوت, { responseType: 'arraybuffer', timeout: 120000 });

        await conn.sendMessage(m.chat, {
            audio: Buffer.from(صوت.data),
            mimetype: 'audio/mpeg',
            fileName: `${سورة.name}.mp3`,
            ptt: false
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            text: `*🎙️ ${سورة.name} — ${سورة.englishName}*\n` +
                `📍 ${سورة.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} | ${سورة.numberOfAyahs} آية\n` +
                `👤 القارئ: ${قارئ.اسم}\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل التحميل:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['تلاوة'];
handler.command = ['تلاوة', 'quranmp3', 'سورة_صوت'];
handler.category = 'islamic';

export default handler;
