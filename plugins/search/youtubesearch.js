/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function بحث_يوتيوب(استعلام) {
    const res = await axios.get('https://www.youtube.com/results', {
        params: { search_query: استعلام },
        headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36' },
        timeout: 15000
    });

    const matches = [...res.data.matchAll(/"videoId":"([\w-]{11})","thumbnail".*?"title":\{"runs":\[.*?"text":"(.*?)"/g)];
    if (!matches.length) throw new Error('ما لقيت نتائج');

    return matches.slice(0, 5).map(m => ({
        id: m[1],
        عنوان: m[2],
        رابط: `https://youtu.be/${m[1]}`
    }));
}

const handler = async (m, { text }) => {
    if (!text) return m.reply('*❌ اكتب اسم الفيديو بعد الأمر*\n\nمثال: .بحث_يوتيوب اغاني عربية');

    m.react('🔍');
    try {
        const نتائج = await بحث_يوتيوب(text);

        let رد = `*🎬 نتائج البحث عن: ${text}*\n${'━'.repeat(30)}\n\n`;
        نتائج.forEach((v, i) => {
            رد += `*${i + 1}.* ${v.عنوان}\n🔗 ${v.رابط}\n\n`;
        });
        رد += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;

        m.reply(رد);
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل البحث:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['بحث_يوتيوب'];
handler.command = ['بحث_يوتيوب', 'youtubesearch', 'yts'];
handler.category = 'search';

export default handler;
