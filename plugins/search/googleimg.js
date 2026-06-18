/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';
import * as cheerio from 'cheerio';

async function بحث_صور_جوجل(استعلام) {
    const { data: html } = await axios.get(
        `https://www.google.com/search?q=${encodeURIComponent(استعلام)}&udm=2`,
        { headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36' }, timeout: 20000 }
    );
    const $ = cheerio.load(html);
    const صور = [];
    $('img.DS1iW, img[data-src]').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src?.startsWith('http')) صور.push(src);
    });
    if (!صور.length) {
        const match = [...html.matchAll(/https?:\/\/[^"' ]+\.(jpg|png|webp)[^"' ]*/g)];
        match.slice(0, 8).forEach(m => صور.push(m[0]));
    }
    return [...new Set(صور)].slice(0, 5);
}

const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*❌ اكتب كلمة البحث بعد الأمر*\n\nمثال: .صور_جوجل Naruto');

    m.react('🔍');
    try {
        const صور = await بحث_صور_جوجل(text);
        if (!صور.length) throw new Error('ما لقيت صور');

        for (const رابط of صور.slice(0, 4)) {
            try {
                const res = await axios.get(رابط, { responseType: 'arraybuffer', timeout: 15000 });
                await conn.sendMessage(m.chat, {
                    image: Buffer.from(res.data),
                    caption: `🔍 *${text}*\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
                }, { quoted: m });
            } catch {}
        }

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل البحث:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['صور_جوجل'];
handler.command = ['صور_جوجل', 'googleimg', 'gimg'];
handler.category = 'search';

export default handler;
