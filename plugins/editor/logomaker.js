/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

const التأثيرات = [
    'electricblue', 'neonlights', 'glowstick', 'volcano', 'broadway',
    'dragonscale', 'medieval', 'piratescove', 'starshine', 'magicdust',
    'cottoncandy', 'fairygarden', 'lavender', 'discodiva', 'ransom',
    'oldenglish', 'ghostship', 'sketchy', 'signature', 'lollipop'
];

async function إنشاء_لوجو(تأثير, نص) {
    const res = await axios.get(`https://logow.cooqueue.com/generate`, {
        params: { effect: تأثير, text: نص, format: 'png' },
        headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://glowtxt.com/' },
        responseType: 'arraybuffer',
        timeout: 30000
    });
    if (res.data?.byteLength < 100) throw new Error('الصورة فارغة');
    return Buffer.from(res.data);
}

const handler = async (m, { conn, text, command }) => {
    if (!text || !text.includes('|')) {
        return m.reply(
            `*✨ صانع اللوجو المزخرف*\n${'━'.repeat(30)}\n\n` +
            `*الاستخدام:*\n.${command} [تأثير] | [نص]\n\n` +
            `*مثال:*\n.${command} electricblue | ESCANOR\n\n` +
            `*بعض التأثيرات المتاحة:*\n${التأثيرات.slice(0, 10).join('\n')}\n\n` +
            `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        );
    }

    const [تأثير, ...أجزاء_نص] = text.split('|').map(v => v.trim());
    const النص = أجزاء_نص.join('|').trim();
    if (!النص) return m.reply('*❌ اكتب النص بعد |*');

    m.react('⏳');
    try {
        const صورة = await إنشاء_لوجو(تأثير, النص);
        await conn.sendMessage(m.chat, {
            image: صورة,
            caption: `✨ *لوجو مزخرف*\n📝 ${النص}\n🎨 تأثير: ${تأثير}\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل الإنشاء:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['لوجو'];
handler.command = ['لوجو', 'logomaker', 'glowtxt'];
handler.category = 'editor';

export default handler;
