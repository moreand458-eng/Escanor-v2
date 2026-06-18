/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import axios from 'axios';

async function جلب_آية(سورة, آية) {
    const res = await axios.get(`https://api.alquran.cloud/v1/ayah/${سورة}:${آية}/ar.alafasy`, {
        timeout: 15000
    });
    return res.data?.data;
}

async function بحث_في_قرآن(نص) {
    const res = await axios.get(`https://api.alquran.cloud/v1/search/${encodeURIComponent(نص)}/all/ar`, {
        timeout: 15000
    });
    return res.data?.data?.matches?.slice(0, 3);
}

async function جلب_سورة(رقم) {
    const res = await axios.get(`https://api.alquran.cloud/v1/surah/${رقم}`, {
        timeout: 15000
    });
    return res.data?.data;
}

const handler = async (m, { text, args, command }) => {
    if (!text) {
        return m.reply(
            `*📖 أوامر القرآن الكريم*\n${'━'.repeat(30)}\n\n` +
            `*جلب آية:*\n.${command} 2:255 ← البقرة آية الكرسي\n\n` +
            `*بحث:*\n.${command} بحث الرحمن\n\n` +
            `*معلومات سورة:*\n.${command} سورة 36 ← سورة يس\n\n` +
            `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        );
    }

    m.react('📖');
    try {
        if (text.includes(':') && !text.startsWith('بحث') && !text.startsWith('سورة')) {
            const [سورة, آية] = text.split(':');
            const بيانات = await جلب_آية(سورة.trim(), آية.trim());
            if (!بيانات) throw new Error('رقم السورة أو الآية غير صحيح');

            const رد = `*📖 ${بيانات.surah?.name} (${بيانات.surah?.englishName})*\n` +
                `*آية ${بيانات.numberInSurah}*\n${'━'.repeat(30)}\n\n` +
                `${بيانات.text}\n\n` +
                `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
            m.reply(رد);

        } else if (text.startsWith('بحث ')) {
            const نتائج = await بحث_في_قرآن(text.slice(4).trim());
            if (!نتائج?.length) throw new Error('ما لقيت نتائج');

            let رد = `*🔍 نتائج البحث في القرآن*\n${'━'.repeat(30)}\n\n`;
            نتائج.forEach((r, i) => {
                رد += `*${i + 1}. ${r.surah?.name} - آية ${r.numberInSurah}*\n${r.text}\n\n`;
            });
            رد += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
            m.reply(رد);

        } else if (text.startsWith('سورة ')) {
            const رقم = text.slice(5).trim();
            const سورة = await جلب_سورة(رقم);
            if (!سورة) throw new Error('رقم السورة غير صحيح');

            const رد = `*📖 سورة ${سورة.name} (${سورة.englishName})*\n${'━'.repeat(30)}\n\n` +
                `🔢 *رقمها:* ${سورة.number}\n` +
                `📝 *معناها:* ${سورة.englishNameTranslation}\n` +
                `📍 *نزولها:* ${سورة.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}\n` +
                `🔢 *عدد الآيات:* ${سورة.numberOfAyahs}\n\n` +
                `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
            m.reply(رد);

        } else {
            const نتائج = await بحث_في_قرآن(text);
            if (!نتائج?.length) throw new Error('ما لقيت نتائج، جرب .قرآن 2:255 لجلب آية');

            let رد = `*🔍 نتائج البحث: ${text}*\n${'━'.repeat(30)}\n\n`;
            نتائج.forEach((r, i) => {
                رد += `*${i + 1}. ${r.surah?.name} - آية ${r.numberInSurah}*\n${r.text}\n\n`;
            });
            رد += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
            m.reply(رد);
        }

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ حصل خطأ:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['قرآن'];
handler.command = ['قرآن', 'quran'];
handler.category = 'islamic';

export default handler;
