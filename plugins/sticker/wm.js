/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import { Sticker } from 'wa-sticker-formatter';

const handler = async (m, { conn, text }) => {
    if (!m.quoted) return m.reply('*❌ رد على ملصق عشان أغير حقوقه*\n\nمثال: .حقوق_ملصق اسم_الباك | اسم_المطور');

    const mime = m.quoted.mimetype || m.quoted.mediaType || '';
    if (!/webp/.test(mime)) return m.reply('*❌ رد على ملصق وليس صورة*');

    m.react('⏳');
    try {
        const [pack = '𝐄𝐒𝐂𝐀𝐍𝛩𝐑', ...authorParts] = (text || '').split('|');
        const author = authorParts.join('|').trim() || 'ESCANOR BOT';

        const buffer = await m.quoted.download();

        const sticker = await new Sticker(buffer, {
            pack: pack.trim(),
            author: author.trim(),
            type: 'full',
            categories: ['🤩', '🎉']
        }).toBuffer();

        await conn.sendMessage(m.chat, { sticker }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل التعديل:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['حقوق_ملصق'];
handler.command = ['حقوق_ملصق', 'wm', 'take'];
handler.category = 'sticker';

export default handler;
