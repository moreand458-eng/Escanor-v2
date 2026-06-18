/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function بحث_كلمات(اسم) {
    const res = await axios.get(`https://api.lyrics.ovh/suggest/${encodeURIComponent(اسم)}`, {
        timeout: 15000
    });
    const أغنية = res.data?.data?.[0];
    if (!أغنية) throw new Error('ما لقيت الأغنية');

    const res2 = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(أغنية.artist.name)}/${encodeURIComponent(أغنية.title)}`, {
        timeout: 15000
    });
    return { عنوان: أغنية.title, فنان: أغنية.artist.name, كلمات: res2.data?.lyrics };
}

const handler = async (m, { text }) => {
    if (!text) return m.reply('*❌ اكتب اسم الأغنية بعد الأمر*\n\nمثال: .كلمات Shape of You');

    m.react('🎵');
    try {
        const { عنوان, فنان, كلمات } = await بحث_كلمات(text);
        if (!كلمات) throw new Error('ما لقيت الكلمات');

        const رد = `*🎵 ${عنوان}*\n👤 ${فنان}\n${'━'.repeat(30)}\n\n${كلمات.slice(0, 3000)}\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
        m.reply(رد);
        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل البحث:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['كلمات'];
handler.command = ['كلمات', 'lyric', 'lyrics'];
handler.category = 'search';

export default handler;
