/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * تحميل القرآن الكريم من surahquran.com
 * mp3quran.net - جودة عالية
 */

import axios from 'axios';

// القراء وروابطهم من mp3quran.net
const القراء = {
    '1':  { اسم: 'مشاري العفاسي',       server: 'server8', code: 'afs'      },
    '2':  { اسم: 'عبد الباسط (مرتل)',   server: 'server7', code: 'Mohammed_Al_Minshawi_Murattal' }, // fallback
    '3':  { اسم: 'سعد الغامدي',         server: 'server7', code: 'Saad_Al_Ghamdi' },
    '4':  { اسم: 'ماهر المعيقلي',       server: 'server12',code: 'maher_al_muaiqly128' },
    '5':  { اسم: 'ياسر الدوسري',        server: 'server11',code: 'yasser_ad-dussary' },
    '6':  { اسم: 'خالد الجليل',         server: 'server8', code: 'khalid_aljalil' },
    '7':  { اسم: 'إسلام صبحي',          server: 'server13',code: 'islam_sobhi' },
    '8':  { اسم: 'عبد الرحمن السديس',   server: 'server11',code: 'abdulrahman_as-sudais' },
    '9':  { اسم: 'محمد جبريل',          server: 'server8', code: 'jbrl'       },
    '10': { اسم: 'المنشاوي (مرتل)',      server: 'server10',code: 'minsh'     },
    '11': { اسم: 'عبد الله الجهني',     server: 'server11',code: 'Abdallah_3awad_Al-Johany' },
    '12': { اسم: 'ناصر القطامي',        server: 'server6', code: 'Nasser_Alqatami' },
    '13': { اسم: 'أحمد العجمي',         server: 'server7', code: 'ahmed_ibn_ali_al-ajamy' },
    '14': { اسم: 'علي الحذيفي',         server: 'server7', code: 'Ali_Alhuthaifi' },
    '15': { اسم: 'وديع اليمني',         server: 'server9', code: 'wadee3' },
};

// أسماء السور (1-114)
const أسماء_السور = [
    'الفاتحة','البقرة','آل عمران','النساء','المائدة','الأنعام','الأعراف','الأنفال','التوبة','يونس',
    'هود','يوسف','الرعد','إبراهيم','الحجر','النحل','الإسراء','الكهف','مريم','طه',
    'الأنبياء','الحج','المؤمنون','النور','الفرقان','الشعراء','النمل','القصص','العنكبوت','الروم',
    'لقمان','السجدة','الأحزاب','سبأ','فاطر','يس','الصافات','ص','الزمر','غافر',
    'فصلت','الشورى','الزخرف','الدخان','الجاثية','الأحقاف','محمد','الفتح','الحجرات','ق',
    'الذاريات','الطور','النجم','القمر','الرحمن','الواقعة','الحديد','المجادلة','الحشر','الممتحنة',
    'الصف','الجمعة','المنافقون','التغابن','الطلاق','التحريم','الملك','القلم','الحاقة','المعارج',
    'نوح','الجن','المزمل','المدثر','القيامة','الإنسان','المرسلات','النبأ','النازعات','عبس',
    'التكوير','الانفطار','المطففين','الانشقاق','البروج','الطارق','الأعلى','الغاشية','الفجر','البلد',
    'الشمس','الليل','الضحى','الشرح','التين','العلق','القدر','البينة','الزلزلة','العاديات',
    'القارعة','التكاثر','العصر','الهمزة','الفيل','قريش','الماعون','الكوثر','الكافرون','النصر',
    'المسد','الإخلاص','الفلق','الناس'
];

function رابط_mp3(قارئ, رقم_سورة) {
    const رقم = String(رقم_سورة).padStart(3, '0');
    return `https://${قارئ.server}.mp3quran.net/${قارئ.code}/${رقم}.mp3`;
}

function قائمة_القراء() {
    return Object.entries(القراء)
        .map(([k, v]) => `${k}. ${v.اسم}`)
        .join('\n');
}

const handler = async (m, { conn, text, command }) => {
    const sep = '━'.repeat(28);

    if (!text) {
        return m.reply(
            `*🕌 تحميل القرآن الكريم mp3*\n${sep}\n\n` +
            `*🎙️ تحميل سورة:*\n` +
            `> .${command} 36 ← سورة يس (العفاسي)\n` +
            `> .${command} 36 2 ← يس بصوت سعد الغامدي\n\n` +
            `*📋 القراء المتاحون:*\n${قائمة_القراء()}\n\n` +
            `*📖 أسماء السور للبحث:*\n` +
            `> .${command} يس ← بحث عن سورة باسمها\n\n` +
            `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        );
    }

    // ─── بحث عن سورة باسمها ───
    if (isNaN(text.trim().split(/\s+/)[0])) {
        const بحث = text.trim().toLowerCase();
        const نتائج = أسماء_السور
            .map((اسم, i) => ({ اسم, رقم: i + 1 }))
            .filter(s => s.اسم.includes(بحث) || s.اسم.toLowerCase().includes(بحث));

        if (!نتائج.length) {
            return m.reply(`*❌ ما لقيتش سورة باسم: ${text}*\n\nاكتب رقم السورة مباشرة (1-114)`);
        }

        let رد = `*🔍 نتائج البحث: "${text}"*\n${sep}\n\n`;
        نتائج.slice(0, 10).forEach(s => {
            رد += `• *${s.رقم}. سورة ${s.اسم}*\n  📥 .${command} ${s.رقم}\n\n`;
        });
        رد += `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`;
        return m.reply(رد);
    }

    // ─── تحميل سورة برقمها ───
    const أجزاء = text.trim().split(/\s+/);
    const رقم_سورة = parseInt(أجزاء[0]);
    const رقم_قارئ = أجزاء[1] || '1';

    if (isNaN(رقم_سورة) || رقم_سورة < 1 || رقم_سورة > 114) {
        return m.reply('*❌ رقم السورة لازم يكون من 1 لـ 114*');
    }

    const قارئ = القراء[رقم_قارئ] || القراء['1'];
    const اسم_السورة = أسماء_السور[رقم_سورة - 1];
    const رابط = رابط_mp3(قارئ, رقم_سورة);

    m.react('⏳');

    try {
        const res = await axios.get(رابط, {
            responseType: 'arraybuffer',
            timeout: 120000,
            headers: {
                'User-Agent': 'Mozilla/5.0',
                'Referer': 'https://surahquran.com/'
            }
        });

        const صوت = Buffer.from(res.data);
        const حجم_mb = (صوت.length / 1024 / 1024).toFixed(1);

        await conn.sendMessage(m.chat, {
            audio: صوت,
            mimetype: 'audio/mpeg',
            fileName: `سورة_${اسم_السورة}_${قارئ.اسم}.mp3`,
            ptt: false
        }, { quoted: m });

        await conn.sendMessage(m.chat, {
            text: `*🎙️ سورة ${اسم_السورة}*\n${sep}\n` +
                `🔢 رقمها: ${رقم_سورة}\n` +
                `👤 القارئ: ${قارئ.اسم}\n` +
                `📦 الحجم: ${حجم_mb} MB\n\n` +
                `> *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT*`
        }, { quoted: m });

        m.react('✅');

    } catch (e) {
        m.react('❌');
        // لو القارئ مش عنده السورة دي نجرب العفاسي
        if (رقم_قارئ !== '1') {
            m.reply(`*❌ القارئ "${قارئ.اسم}" مش عنده السورة دي*\nجرب القارئ رقم 1 (العفاسي): .${command} ${رقم_سورة} 1`);
        } else {
            m.reply(`*❌ فشل التحميل:* ${e.message?.slice(0, 80)}`);
        }
    }
};

handler.usage = ['قرآن_mp3'];
handler.command = ['قرآن_mp3', 'quranmp3', 'تلاوة', 'تحميل_قرآن'];
handler.category = 'islamic';

export default handler;
