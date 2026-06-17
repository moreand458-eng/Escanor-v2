/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

const الأصوات = {
    'ميكو': '67aee909-5d4b-11ee-a861-00163e2ac61b',
    'غوكو': '67aed50c-5d4b-11ee-a861-00163e2ac61b',
    'ناروتو': '67aecc87-5d4b-11ee-a861-00163e2ac61b',
    'ليفاي': '67aecde0-5d4b-11ee-a861-00163e2ac61b',
    'ايمينيم': 'c82964b9-d093-11ee-bfb7-e86f38d7ec1a',
};

function IP_عشوائي() {
    return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
}

async function نص_لصوت_أنمي(نص, صوت_id) {
    const ip = IP_عشوائي();
    const res = await axios.post('https://ttsmp3.com/makemp3_new.php',
        new URLSearchParams({ msg: نص, lang: صوت_id, source: 'ttsmp3' }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'User-Agent': 'Mozilla/5.0',
                'X-Forwarded-For': ip
            },
            timeout: 30000
        }
    );

    const رابط = res.data?.URL;
    if (!رابط) throw new Error('فشل توليد الصوت');

    const صوت = await axios.get(رابط, { responseType: 'arraybuffer', timeout: 30000 });
    return Buffer.from(صوت.data);
}

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        return m.reply(
            `*🎙️ نص لصوت أنمي*\n${'━'.repeat(30)}\n\n` +
            `*الاستخدام:*\n.${command} [صوت] [نص]\n\n` +
            `*الأصوات المتاحة:*\n` +
            Object.keys(الأصوات).map((v, i) => `${i + 1}. ${v}`).join('\n') +
            `\n\n*مثال:*\n.${command} ميكو مرحبا بالعالم\n\n` +
            `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        );
    }

    m.react('🎙️');
    try {
        const أجزاء = text.split(' ');
        let صوت_مختار = 'ميكو';
        let النص = text;

        if (الأصوات[أجزاء[0]]) {
            صوت_مختار = أجزاء[0];
            النص = أجزاء.slice(1).join(' ');
        }
        if (!النص.trim()) throw new Error('اكتب النص بعد اسم الصوت');

        const buffer = await نص_لصوت_أنمي(النص, الأصوات[صوت_مختار]);

        await conn.sendMessage(m.chat, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل توليد الصوت:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['صوت_أنمي'];
handler.command = ['صوت_أنمي', 'ttsanime', 'انمي_صوت'];
handler.category = 'ai';

export default handler;
