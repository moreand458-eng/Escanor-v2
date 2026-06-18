/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function معلومات_جيتهاب(مستخدم) {
    const [user, repos] = await Promise.all([
        axios.get(`https://api.github.com/users/${مستخدم}`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000
        }),
        axios.get(`https://api.github.com/users/${مستخدم}/repos?per_page=5&sort=updated`, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 15000
        })
    ]);
    return { user: user.data, repos: repos.data };
}

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*❌ اكتب اسم المستخدم بعد الأمر*\n\nمثال: .جيتهاب torvalds');

    m.react('🔍');
    try {
        const { user, repos } = await معلومات_جيتهاب(text.replace('@', '').trim());

        let رد = `*🐙 معلومات حساب GitHub*\n${'━'.repeat(30)}\n\n`;
        رد += `👤 *الاسم:* ${user.name || 'غير محدد'}\n`;
        رد += `🔑 *المعرف:* @${user.login}\n`;
        رد += `📝 *السيرة:* ${user.bio?.slice(0, 100) || 'لا يوجد'}\n`;
        رد += `📍 *الموقع:* ${user.location || 'غير محدد'}\n`;
        رد += `🏢 *الشركة:* ${user.company || 'غير محدد'}\n`;
        رد += `👥 *المتابعون:* ${user.followers?.toLocaleString('ar')}\n`;
        رد += `➡️ *يتابع:* ${user.following?.toLocaleString('ar')}\n`;
        رد += `📦 *المستودعات:* ${user.public_repos?.toLocaleString('ar')}\n`;
        رد += `⭐ *الجيست:* ${user.public_gists?.toLocaleString('ar')}\n`;
        رد += `🔗 ${user.html_url}\n\n`;

        if (repos.length) {
            رد += `*📦 آخر المستودعات:*\n`;
            repos.slice(0, 5).forEach((r, i) => {
                رد += `${i + 1}. ${r.name} ⭐${r.stargazers_count}\n`;
            });
        }

        رد += `\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;

        if (user.avatar_url) {
            const img = await axios.get(user.avatar_url, { responseType: 'arraybuffer', timeout: 15000 });
            await conn.sendMessage(m.chat, { image: Buffer.from(img.data), caption: رد }, { quoted: m });
        } else {
            m.reply(رد);
        }

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل جلب المعلومات:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['جيتهاب'];
handler.command = ['جيتهاب', 'githubstalk', 'github'];
handler.category = 'search';

export default handler;
