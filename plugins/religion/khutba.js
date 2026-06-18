const KHUTAB = [
    { title: 'خطبة الوداع', text: 'أيها الناس، إن دماءكم وأموالكم حرام عليكم كحرمة يومكم هذا في شهركم هذا في بلدكم هذا. وإنكم ستلقون ربكم فيسألكم عن أعمالكم.' },
    { title: 'خطبة عن الوقت', text: 'أيها المسلمون، الوقت هو الحياة، من أضاع وقته فقد أضاع حياته. يقول النبي ﷺ: نعمتان مغبون فيهما كثير من الناس: الصحة والفراغ.' },
    { title: 'خطبة عن الأخلاق', text: 'إن المسلم يُعرف بأخلاقه قبل عبادته. قال النبي ﷺ: إنما بعثت لأتمم مكارم الأخلاق. فالمسلم الحق من حسن خلقه مع الله ومع الناس.' },
];
const handler = async (m, { conn }) => {
    const k = KHUTAB[Math.floor(Math.random() * KHUTAB.length)];
    await conn.sendMessage(m.chat, {
        text: `📢 *${k.title}*\n\n${k.text}\n\n> _والله أعلم، والحمد لله رب العالمين_`
    }, { quoted: m });
};
handler.command  = ['خطبه', 'خطبة'];
handler.usage    = ['خطبه'];
handler.category = 'religion';
export default handler;
