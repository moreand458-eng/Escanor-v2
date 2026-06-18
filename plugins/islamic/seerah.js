/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

const الحلقات = Array.from({ length: 30 }, (_, i) => ({
    رقم: i + 1,
    رابط: `https://archive.org/download/seera_nabawiya_al3awadi/seera${String(i + 1).padStart(2, '0')}.mp3`
}));

const handler = async (m, { conn, text, command }) => {
    if (!text) {
        let قائمة = `*📖 السيرة النبوية — نبيل العوضي*\n${'━'.repeat(30)}\n\n`;
        قائمة += `*الاستخدام:*\n.${command} [رقم الحلقة]\n\n`;
        قائمة += `*مثال:* .${command} 1\n\n`;
        قائمة += `*الحلقات المتاحة:* 1 — ${الحلقات.length}\n\n`;
        قائمة += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
        return m.reply(قائمة);
    }

    const رقم = parseInt(text.trim());
    if (isNaN(رقم) || رقم < 1 || رقم > الحلقات.length) {
        return m.reply(`*❌ رقم الحلقة غير صحيح (1-${الحلقات.length})*`);
    }

    m.react('⏳');
    try {
        const حلقة = الحلقات[رقم - 1];
        const صوت = await axios.get(حلقة.رابط, { responseType: 'arraybuffer', timeout: 120000 });

        await conn.sendMessage(m.chat, {
            audio: Buffer.from(صوت.data),
            mimetype: 'audio/mpeg',
            fileName: `سيرة_نبوية_${رقم}.mp3`,
            ptt: false
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            text: `*📖 السيرة النبوية*\n*الحلقة ${رقم}*\n👤 الشيخ نبيل العوضي\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل التحميل:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['سيرة'];
handler.command = ['سيرة', 'seerah', 'سيرة_نبوية'];
handler.category = 'islamic';

export default handler;
