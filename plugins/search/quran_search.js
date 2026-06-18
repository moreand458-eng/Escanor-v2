/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * بحث وتحميل القرآن الكريم
 */

import axios from 'axios';

const القراء = {
    '1': { اسم: 'مشاري العفاسي',        id: 'alafasy' },
    '2': { اسم: 'عبد الباسط',           id: 'abdulbasitmurattal' },
    '3': { اسم: 'سعد الغامدي',          id: 'saoodashuraimalarfani' },
    '4': { اسم: 'ماهر المعيقلي',        id: 'mahermuaiqly' },
    '5': { اسم: 'محمد صديق المنشاوي',   id: 'minshawi' },
    '6': { اسم: 'نصر القطامي',          id: 'parhizgar' },
};

// بحث في القرآن بكلمة أو جملة
async function بحث_قرآن(نص, صفحة = 0) {
    const res = await axios.get(
        `https://api.alquran.cloud/v1/search/${encodeURIComponent(نص)}/all/ar`,
        { timeout: 15000 }
    );
    const كل = res.data?.data?.matches || [];
    const start = صفحة * 5;
    return { نتائج: كل.slice(start, start + 5), الإجمالي: كل.length };
}

// تحميل سورة صوت
async function تحميل_سورة(رقم_سورة, id_قارئ) {
    const url = `https://cdn.islamic.network/quran/audio-surah/128/${id_قارئ}/${رقم_سورة}.mp3`;
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 120000 });
    return Buffer.from(res.data);
}

// معلومات سورة
async function معلومات_سورة(رقم) {
    const res = await axios.get(`https://api.alquran.cloud/v1/surah/${رقم}`, { timeout: 15000 });
    return res.data?.data;
}

const handler = async (m, { conn, text, command }) => {
    const sep = '━'.repeat(28);

    if (!text) {
        return m.reply(
            `*🕌 بحث وتحميل القرآن الكريم*\n${sep}\n\n` +
            `*🔍 بحث عن كلمة أو آية:*\n` +
            `> .${command} بحث الرحمن الرحيم\n\n` +
            `*🎙️ تحميل سورة (صوت):*\n` +
            `> .${command} تحميل 36 ← يس بصوت العفاسي\n` +
            `> .${command} تحميل 36 2 ← عبد الباسط\n\n` +
            `*📖 جلب آية بالرقم:*\n` +
            `> .${command} 2:255 ← آية الكرسي\n\n` +
            `*📋 معلومات سورة:*\n` +
            `> .${command} سورة 18 ← الكهف\n\n` +
            `*القراء المتاحون:*\n` +
            Object.entries(القراء).map(([k, v]) => `${k}. ${v.اسم}`).join('\n') +
            `\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        );
    }

    m.react('📖');

    try {
        // ─── تحميل سورة ───
        if (text.startsWith('تحميل ') || text.startsWith('download ')) {
            const أجزاء = text.trim().split(/\s+/);
            const رقم_سورة = parseInt(أجزاء[1]);
            const رقم_قارئ = أجزاء[2] || '1';

            if (isNaN(رقم_سورة) || رقم_سورة < 1 || رقم_سورة > 114) {
                return m.reply('*❌ رقم السورة لازم يكون من 1 لـ 114*');
            }

            const قارئ = القراء[رقم_قارئ] || القراء['1'];
            const سورة = await معلومات_سورة(رقم_سورة);
            if (!سورة) throw new Error('رقم السورة غير صحيح');

            m.react('⏳');
            const صوت = await تحميل_سورة(رقم_سورة, قارئ.id);

            await conn.sendMessage(m.chat, {
                audio: صوت,
                mimetype: 'audio/mpeg',
                fileName: `${سورة.name}.mp3`,
                ptt: false
            }, { quoted: m });

            await conn.sendMessage(m.chat, {
                text: `*🎙️ ${سورة.name} — ${سورة.englishName}*\n${sep}\n` +
                    `📍 ${سورة.revelationType === 'Meccan' ? 'مكية' : 'مدنية'} | ${سورة.numberOfAyahs} آية\n` +
                    `👤 القارئ: ${قارئ.اسم}\n\n> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
            }, { quoted: m });

            return m.react('✅');
        }

        // ─── بحث ───
        if (text.startsWith('بحث ') || text.startsWith('search ')) {
            const كلمة = text.replace(/^(بحث|search)\s+/, '').trim();
            if (!كلمة) return m.reply('*❌ اكتب الكلمة اللي تبحث عنها*');

            const { نتائج, الإجمالي } = await بحث_قرآن(كلمة);
            if (!نتائج.length) return m.reply(`*❌ مفيش نتائج لـ: ${كلمة}*`);

            let رد = `*🔍 نتائج البحث: "${كلمة}"*\n${sep}\n` +
                `📊 إجمالي: ${الإجمالي} نتيجة — عرض أول 5\n\n`;

            نتائج.forEach((r, i) => {
                رد += `*${i + 1}. ${r.surah?.name} — آية ${r.numberInSurah}*\n`;
                رد += `${r.text}\n\n`;
            });

            رد += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
            return m.reply(رد);
        }

        // ─── معلومات سورة ───
        if (text.startsWith('سورة ') || text.startsWith('surah ')) {
            const رقم = text.replace(/^(سورة|surah)\s+/, '').trim();
            const سورة = await معلومات_سورة(رقم);
            if (!سورة) throw new Error('رقم السورة غير صحيح (1-114)');

            return m.reply(
                `*📖 سورة ${سورة.name}*\n${sep}\n\n` +
                `🔢 *رقمها:* ${سورة.number}\n` +
                `📝 *معناها:* ${سورة.englishNameTranslation}\n` +
                `📍 *نزولها:* ${سورة.revelationType === 'Meccan' ? 'مكية' : 'مدنية'}\n` +
                `🕌 *عدد الآيات:* ${سورة.numberOfAyahs}\n\n` +
                `💡 للاستماع: .${command} تحميل ${سورة.number}\n\n` +
                `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
            );
        }

        // ─── جلب آية برقمها (2:255) ───
        if (/^\d+:\d+$/.test(text.trim())) {
            const [رقم_سورة, رقم_آية] = text.split(':').map(s => s.trim());
            const res = await axios.get(
                `https://api.alquran.cloud/v1/ayah/${رقم_سورة}:${رقم_آية}/ar.alafasy`,
                { timeout: 15000 }
            );
            const بيانات = res.data?.data;
            if (!بيانات) throw new Error('رقم السورة أو الآية غير صحيح');

            return m.reply(
                `*📖 ${بيانات.surah?.name} — آية ${بيانات.numberInSurah}*\n${sep}\n\n` +
                `${بيانات.text}\n\n` +
                `💡 للاستماع: .${command} تحميل ${رقم_سورة}\n\n` +
                `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
            );
        }

        // ─── بحث تلقائي ───
        const { نتائج, الإجمالي } = await بحث_قرآن(text);
        if (!نتائج.length) {
            return m.reply(
                `*❌ مفيش نتائج لـ: ${text}*\n\n` +
                `جرب:\n• .${command} 2:255 ← لجلب آية\n• .${command} تحميل 36 ← لتحميل سورة`
            );
        }

        let رد = `*🔍 نتائج: "${text}"*\n${sep}\n📊 ${الإجمالي} نتيجة — عرض أول 5\n\n`;
        نتائج.forEach((r, i) => {
            رد += `*${i + 1}. ${r.surah?.name} — آية ${r.numberInSurah}*\n${r.text}\n\n`;
        });
        رد += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
        m.reply(رد);

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ حصل خطأ:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['قران'];
handler.command = ['قران', 'quran-dl', 'قرآن-بحث'];
handler.category = 'islamic';

export default handler;
