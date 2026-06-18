const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*مثال:* .تفسير الفاتحة:1');
    const parts = text.trim().split(':');
    const surahQuery = parts[0]?.trim();
    const ayahNum = parseInt(parts[1]) || 1;

    try {
        // نجيب رقم السورة أول
        const searchRes = await fetch(`https://api.alquran.cloud/v1/surah`, { signal: AbortSignal.timeout(10000) });
        const searchData = await searchRes.json();
        const surah = searchData.data?.find(s =>
            s.name.includes(surahQuery) ||
            s.englishName.toLowerCase().includes(surahQuery.toLowerCase()) ||
            s.number === parseInt(surahQuery)
        );
        if (!surah) return m.reply('*❌ السورة غير موجودة*');

        const res = await fetch(`https://api.alquran.cloud/v1/ayah/${surah.number}:${ayahNum}/ar.muyassar`, { signal: AbortSignal.timeout(10000) });
        const data = await res.json();
        if (data.status !== 'OK') throw new Error();
        const ayah = data.data;

        await conn.sendMessage(m.chat, {
            text:
                `📖 *تفسير ميسر*\n\n` +
                `*﴿${ayah.text}﴾*\n` +
                `سورة ${surah.name} - آية ${ayahNum}\n\n` +
                `> _تفسير الجلالين_`
        }, { quoted: m });
    } catch {
        await m.reply('*❌ لم يتم العثور على التفسير*');
    }
};
handler.command  = ['تفسير'];
handler.usage    = ['تفسير'];
handler.category = 'religion';
export default handler;
