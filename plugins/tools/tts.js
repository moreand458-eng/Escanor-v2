import axios from 'axios';

const أصوات = [
    { اسم: 'عربي', كود: 'ar' },
    { اسم: 'إنجليزي', كود: 'en' },
    { اسم: 'فرنسي', كود: 'fr' },
    { اسم: 'تركي', كود: 'tr' },
    { اسم: 'إسباني', كود: 'es' },
    { اسم: 'ألماني', كود: 'de' },
];

async function نص_لصوت(نص, لغة = 'ar') {
    // المحاولة الأولى: Google TTS (مجاني بدون key)
    try {
        const رابط = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(نص)}&tl=${لغة}&client=tw-ob`;
        const res = await axios.get(رابط, {
            responseType: 'arraybuffer',
            timeout: 30000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36',
                'Referer': 'https://translate.google.com/'
            }
        });
        const buf = Buffer.from(res.data);
        if (buf.length > 1000) return buf;
        throw new Error('response too small');
    } catch {}

    // Fallback: StreamElements Brian (إنجليزي) أو ar للعربي
    const صوت = لغة === 'ar' ? 'Mizuki' : 'Brian';
    const fallback = await axios.get(
        `https://api.streamelements.com/kappa/v2/speech?voice=${صوت}&text=${encodeURIComponent(نص)}`,
        { responseType: 'arraybuffer', timeout: 30000 }
    );
    return Buffer.from(fallback.data);
}

const handler = async (m, { conn, text, args, command }) => {
    if (!text) {
        return m.reply(
            `*🔊 أمر النطق (نص لصوت)*\n\n` +
            `*الاستخدام:*\n` +
            `• .${command} مرحبا بكم\n` +
            `• .${command} ar مرحبا بكم\n` +
            `• .${command} en Hello everyone\n\n` +
            `*اللغات المتاحة:*\n` +
            أصوات.map(v => `${v.اسم} ← ${v.كود}`).join('\n')
        );
    }

    m.react('🎧');

    try {
        let لغة = 'ar';
        let نص_للنطق = text;

        if (args.length >= 2 && /^[a-z]{2,5}$/i.test(args[0])) {
            لغة = args[0].toLowerCase();
            نص_للنطق = args.slice(1).join(' ');
        }

        // StreamElements - مجاني ومضمون
        const أصوات_stream = {
            'ar': 'Zeina',
            'en': 'Brian',
            'fr': 'Mathieu',
            'de': 'Hans',
            'es': 'Enrique',
            'tr': 'Filiz'
        };
        
        const صوت = أصوات_stream[لغة] || 'Brian';
        const res = await axios.get(
            `https://api.streamelements.com/kappa/v2/speech?voice=${صوت}&text=${encodeURIComponent(نص_للنطق)}`,
            { responseType: 'arraybuffer', timeout: 30000 }
        );

        const buffer = Buffer.from(res.data);

        await conn.sendMessage(m.chat, {
            audio: buffer,
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل النطق:* ${e.message?.slice(0, 100)}`);
    }
};

handler.usage = ['نطق'];
handler.command = ['نطق', 'tts', 'نص_لصوت'];
handler.category = 'tools';

export default handler;
