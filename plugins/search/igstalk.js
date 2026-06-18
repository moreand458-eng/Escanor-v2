/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function معلومات_انستا(اسم_مستخدم) {
    const res = await axios.get(`https://www.instagram.com/${اسم_مستخدم}/?__a=1&__d=dis`, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
            'Accept': 'application/json',
            'Referer': 'https://www.instagram.com/'
        },
        timeout: 20000
    });

    const user = res.data?.graphql?.user || res.data?.data?.user;
    if (!user) throw new Error('ما قدرت أجيب معلومات الحساب');
    return user;
}

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*❌ اكتب اسم المستخدم بعد الأمر*\n\nمثال: .انستا_معلومات cristiano');

    m.react('🔍');
    try {
        const user = await معلومات_انستا(text.replace('@', '').trim());

        const رد = `*📸 معلومات حساب انستقرام*\n${'━'.repeat(30)}\n\n` +
            `👤 *الاسم:* ${user.full_name || 'غير محدد'}\n` +
            `🔑 *المعرف:* @${user.username}\n` +
            `📝 *السيرة:* ${user.biography?.slice(0, 100) || 'لا يوجد'}\n` +
            `👥 *المتابعون:* ${user.edge_followed_by?.count?.toLocaleString('ar') || '0'}\n` +
            `➡️ *يتابع:* ${user.edge_follow?.count?.toLocaleString('ar') || '0'}\n` +
            `🖼️ *المنشورات:* ${user.edge_owner_to_timeline_media?.count?.toLocaleString('ar') || '0'}\n` +
            `✅ *موثق:* ${user.is_verified ? 'نعم ✓' : 'لا'}\n` +
            `🔒 *خاص:* ${user.is_private ? 'نعم' : 'لا'}\n` +
            `🔗 https://instagram.com/${user.username}\n\n` +
            `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;

        if (user.profile_pic_url_hd || user.profile_pic_url) {
            const img = await axios.get(user.profile_pic_url_hd || user.profile_pic_url, {
                responseType: 'arraybuffer', timeout: 15000
            });
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

handler.usage = ['انستا_معلومات'];
handler.command = ['انستا_معلومات', 'igstalk', 'ig_stalk'];
handler.category = 'search';

export default handler;
