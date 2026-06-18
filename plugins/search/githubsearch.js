/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function بحث_جيتهاب(كلمة) {
    const res = await axios.get('https://api.github.com/search/repositories', {
        params: { q: كلمة, sort: 'stars', per_page: 5 },
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/vnd.github.v3+json' },
        timeout: 15000
    });
    if (!res.data?.items?.length) throw new Error('ما لقيت نتائج');
    return res.data.items;
}

const handler = async (m, { text }) => {
    if (!text) return m.reply('*❌ اكتب كلمة البحث بعد الأمر*\n\nمثال: .بحث_جيتهاب whatsapp bot');

    m.react('🔍');
    try {
        const نتائج = await بحث_جيتهاب(text);
        let رد = `*🐙 نتائج GitHub: ${text}*\n${'━'.repeat(30)}\n\n`;
        نتائج.forEach((r, i) => {
            رد += `*${i + 1}.* ${r.full_name}\n`;
            رد += `⭐ ${r.stargazers_count?.toLocaleString('ar')} | 🍴 ${r.forks_count?.toLocaleString('ar')}\n`;
            رد += `📝 ${r.description?.slice(0, 60) || 'لا يوجد وصف'}\n`;
            رد += `🔗 ${r.html_url}\n\n`;
        });
        رد += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
        m.reply(رد);
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل البحث:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['بحث_جيتهاب'];
handler.command = ['بحث_جيتهاب', 'githubsearch', 'gh'];
handler.category = 'search';

export default handler;
