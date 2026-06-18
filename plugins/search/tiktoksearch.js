/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function بحث_تيك_توك(استعلام) {
    const res = await axios.get('https://www.tiktok.com/api/search/general/full/', {
        params: {
            keyword: استعلام,
            count: 5,
            offset: 0,
            from_page: 'search'
        },
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
            'Referer': 'https://www.tiktok.com/'
        },
        timeout: 20000
    });

    const بيانات = res.data?.data?.filter(x => x.type === 1)?.map(x => x.item) || [];
    if (!بيانات.length) throw new Error('ما لقيت نتائج');

    return بيانات.slice(0, 5).map(v => ({
        عنوان: v.desc || 'بدون عنوان',
        مؤلف: v.author?.nickname || v.author?.uniqueId || 'مجهول',
        مشاهدات: v.stats?.playCount?.toLocaleString('ar') || '0',
        رابط: `https://www.tiktok.com/@${v.author?.uniqueId}/video/${v.id}`
    }));
}

const handler = async (m, { text }) => {
    if (!text) return m.reply('*❌ اكتب كلمة البحث بعد الأمر*\n\nمثال: .بحث_تيك مضحك');

    m.react('🔍');
    try {
        const نتائج = await بحث_تيك_توك(text);

        let رد = `*🎵 نتائج التيك توك: ${text}*\n${'━'.repeat(30)}\n\n`;
        نتائج.forEach((v, i) => {
            رد += `*${i + 1}.* ${v.عنوان}\n`;
            رد += `👤 ${v.مؤلف} | 👁️ ${v.مشاهدات}\n`;
            رد += `🔗 ${v.رابط}\n\n`;
        });
        رد += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;

        m.reply(رد);
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل البحث:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['بحث_تيك'];
handler.command = ['بحث_تيكتوك', 'tiktoksearch'];
handler.category = 'search';

export default handler;
