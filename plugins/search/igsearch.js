/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function بحث_انستا(استعلام, عدد = 5) {
    const cx = 'e500c3a7a523b49df';
    const ins = axios.create({
        headers: {
            'user-agent': 'Mozilla/5.0 (Linux; Android 16; SM-F966B) AppleWebKit/537.36'
        }
    });

    const { data: init } = await ins.get('https://cse.google.com/cse.js', { params: { cx }, timeout: 15000 });
    const cfg_ = init.match(/\}\)\((\{[\s\S]*?\})\);/);
    if (!cfg_?.[1]) throw new Error('فشل جلب الإعدادات');
    const cfg = JSON.parse(cfg_[1]);

    const { data: نتائج } = await ins.get('https://cse.google.com/cse/element/v1', {
        params: {
            rsz: 'filtered_cse', num: عدد, hl: 'ar', source: 'gcsc',
            cselibv: cfg.cselibVersion, cx, q: `${استعلام} site:instagram.com/reels`,
            safe: 'off', cse_tok: cfg.cse_token, filter: 0, sort: ''
        },
        timeout: 20000
    });

    const عناصر = نتائج?.results || نتائج?.cursor?.resultCount;
    if (!نتائج?.results?.length) throw new Error('ما لقيت نتائج');
    return نتائج.results;
}

const handler = async (m, { text }) => {
    if (!text) return m.reply('*❌ اكتب كلمة البحث بعد الأمر*\n\nمثال: .بحث_انستا رياضة');

    m.react('🔍');
    try {
        const نتائج = await بحث_انستا(text);
        let رد = `*📸 نتائج انستقرام: ${text}*\n${'━'.repeat(30)}\n\n`;
        نتائج.slice(0, 5).forEach((r, i) => {
            رد += `*${i + 1}.* ${r.title || 'بدون عنوان'}\n`;
            رد += `🔗 ${r.url || r.link}\n\n`;
        });
        رد += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
        m.reply(رد);
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل البحث:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['بحث_انستا'];
handler.command = ['بحث_انستا', 'igsearch', 'ig_search'];
handler.category = 'search';

export default handler;
