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

function خلط(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

async function بحث_ميديافاير(استعلام) {
    const { data: html } = await axios.get(
        `https://mediafiretrend.com/?q=${encodeURIComponent(استعلام)}&search=Search`,
        { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 }
    );
    const $ = cheerio.load(html);
    const روابط = خلط(
        $('tbody tr a[href*="/f/"]').map((_, el) => $(el).attr('href')).get()
    ).slice(0, 5);

    if (!روابط.length) throw new Error('ما لقيت نتائج');

    const نتائج = await Promise.all(روابط.map(async رابط => {
        try {
            const { data } = await axios.get(`https://mediafiretrend.com${رابط}`, {
                headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000
            });
            const $2 = cheerio.load(data);
            const اسم = $2('tr:nth-child(2) td:nth-child(2) b').text().trim();
            const حجم = $2('tr:nth-child(3) td:nth-child(2)').text().trim();
            const raw = $2('div.info tbody tr:nth-child(4) td:nth-child(2) script').text();
            const match = raw.match(/unescape\(['"`]([^'"`]+)['"`]\)/);
            const رابط_تحميل = match ? cheerio.load(decodeURIComponent(match[1]))('a').attr('href') : null;
            return { اسم, حجم, رابط_تحميل };
        } catch { return null; }
    }));

    return نتائج.filter(Boolean);
}

const handler = async (m, { text }) => {
    if (!text) return m.reply('*❌ اكتب كلمة البحث بعد الأمر*\n\nمثال: .بحث_ميديافاير minecraft');

    m.react('🔍');
    try {
        const نتائج = await بحث_ميديافاير(text);

        let رد = `*🔍 نتائج ميديافاير: ${text}*\n${'━'.repeat(30)}\n\n`;
        نتائج.forEach((r, i) => {
            رد += `*${i + 1}.* ${r.اسم || 'بدون اسم'}\n`;
            if (r.حجم) رد += `📦 ${r.حجم}\n`;
            if (r.رابط_تحميل) رد += `🔗 ${r.رابط_تحميل}\n`;
            رد += '\n';
        });
        رد += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;

        m.reply(رد);
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل البحث:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['بحث_ميديافاير'];
handler.command = ['بحث_ميديافاير', 'mediafiresearch', 'mfsearch'];
handler.category = 'search';

export default handler;
