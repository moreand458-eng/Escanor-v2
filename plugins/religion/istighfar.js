const ISTIG = [
    'أَسْتَغْفِرُ اللهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
    'أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ',
    'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ، دِقَّهُ وَجِلَّهُ، وَأَوَّلَهُ وَآخِرَهُ',
];
const handler = async (m, { conn }) => {
    const istig = ISTIG[Math.floor(Math.random() * ISTIG.length)];
    await conn.sendMessage(m.chat, {
        text: `🕌 *الاستغفار*\n\n*${istig}*\n\n> _تب إلى الله توبة نصوحاً_`
    }, { quoted: m });
};
handler.command  = ['استغفار', 'استغفر'];
handler.usage    = ['استغفار'];
handler.category = 'religion';
export default handler;
