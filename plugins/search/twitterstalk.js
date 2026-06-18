/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';
import crypto from 'crypto';

async function معلومات_تويتر(مستخدم) {
    const تحدي = await axios.get('https://twittermedia.b-cdn.net/challenge/', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
            'Accept': 'application/json',
            'origin': 'https://snaplytics.io',
            'referer': 'https://snaplytics.io/'
        },
        timeout: 15000
    });

    const بيانات_تحدي = تحدي.data;
    if (!بيانات_تحدي?.challenge_id) throw new Error('فشل التحقق');

    const hash = crypto.createHash('sha256')
        .update(String(بيانات_تحدي.timestamp) + بيانات_تحدي.random_value)
        .digest('hex').slice(0, 8);

    const ملف_شخصي = await axios.get(
        `https://twittermedia.b-cdn.net/viewer/?data=${مستخدم}&type=profile`,
        {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10)',
                'Accept': 'application/json',
                'origin': 'https://snaplytics.io',
                'referer': 'https://snaplytics.io/',
                'x-challenge-id': بيانات_تحدي.challenge_id,
                'x-challenge-solution': hash
            },
            timeout: 15000
        }
    );

    return ملف_شخصي.data;
}

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*❌ اكتب اسم المستخدم بعد الأمر*\n\nمثال: .تويتر_معلومات elonmusk');

    m.react('🔍');
    try {
        const user = await معلومات_تويتر(text.replace('@', '').trim());
        if (!user) throw new Error('ما قدرت أجيب معلومات الحساب');

        const رد =
            `*🐦 معلومات حساب X/تويتر*\n${'━'.repeat(30)}\n\n` +
            `👤 *الاسم:* ${user.name || 'غير محدد'}\n` +
            `🔑 *المعرف:* @${user.screen_name || user.username || text}\n` +
            `📝 *البايو:* ${user.description?.slice(0, 100) || 'لا يوجد'}\n` +
            `👥 *المتابعون:* ${user.followers_count?.toLocaleString('ar') || '0'}\n` +
            `➡️ *يتابع:* ${user.friends_count?.toLocaleString('ar') || '0'}\n` +
            `🐦 *التغريدات:* ${user.statuses_count?.toLocaleString('ar') || '0'}\n` +
            `❤️ *الإعجابات:* ${user.favourites_count?.toLocaleString('ar') || '0'}\n` +
            `✅ *موثق:* ${user.verified ? 'نعم ✓' : 'لا'}\n` +
            `📍 *الموقع:* ${user.location || 'غير محدد'}\n` +
            `🔗 https://x.com/${user.screen_name || text}\n\n` +
            `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;

        if (user.profile_image_url_https) {
            const img = await axios.get(
                user.profile_image_url_https.replace('_normal', ''),
                { responseType: 'arraybuffer', timeout: 15000 }
            );
            await conn.sendMessage(m.chat, {
                image: Buffer.from(img.data),
                caption: رد
            }, { quoted: m });
        } else {
            m.reply(رد);
        }

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل جلب المعلومات:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['تويتر_معلومات'];
handler.command = ['تويتر_معلومات', 'twitterstalk', 'xstalk'];
handler.category = 'search';

export default handler;
