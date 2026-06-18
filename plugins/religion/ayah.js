const handler = async (m, { conn }) => {
    try {
        const res = await fetch('https://api.alquran.cloud/v1/ayah/' + (Math.floor(Math.random() * 6236) + 1) + '/ar.alafasy', {
            signal: AbortSignal.timeout(10000)
        });
        const data = await res.json();
        if (data.status !== 'OK') throw new Error('API error');
        const ayah = data.data;
        await conn.sendMessage(m.chat, {
            text:
                `┌──────────────────┐\n` +
                `│  🕌 *آيـة قرآنيـة*  │\n` +
                `└──────────────────┘\n\n` +
                `*﴿${ayah.text}﴾*\n\n` +
                `📖 *سورة ${ayah.surah.name}* - آية ${ayah.numberInSurah}\n` +
                `> _${ayah.surah.englishNameTranslation}_`
        }, { quoted: m });
    } catch {
        await m.reply('*❌ تعذر جلب الآية، جرب مرة أخرى*');
    }
};
handler.command  = ['ايه', 'آية', 'اية'];
handler.usage    = ['ايه'];
handler.category = 'religion';
export default handler;
