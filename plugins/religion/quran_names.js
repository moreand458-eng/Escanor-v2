const NAMES = [
    { name: 'الله', meaning: 'اسم الذات الإلهية الجامع لجميع الصفات' },
    { name: 'الرحمن', meaning: 'ذو الرحمة الواسعة الشاملة لجميع الخلق' },
    { name: 'الرحيم', meaning: 'المنعم على المؤمنين برحمة خاصة' },
    { name: 'الملك', meaning: 'المالك لجميع الموجودات' },
    { name: 'القدوس', meaning: 'المنزه عن كل نقص وعيب' },
    { name: 'السلام', meaning: 'ذو السلامة من كل نقص' },
    { name: 'المؤمن', meaning: 'الذي يصدق عباده المؤمنين' },
    { name: 'العزيز', meaning: 'الغالب القاهر الذي لا يُغلب' },
    { name: 'الخالق', meaning: 'الموجد للأشياء من العدم' },
    { name: 'الرزاق', meaning: 'الذي يرزق جميع المخلوقات' },
];
const handler = async (m, { conn }) => {
    const n = NAMES[Math.floor(Math.random() * NAMES.length)];
    await conn.sendMessage(m.chat, {
        text: `✨ *من أسماء الله الحسنى*\n\n*${n.name}*\n\n📖 المعنى: ${n.meaning}\n\n> _له الأسماء الحسنى فادعوه بها_`
    }, { quoted: m });
};
handler.command  = ['الله', 'اسماء_الله'];
handler.usage    = ['الله'];
handler.category = 'religion';
export default handler;
