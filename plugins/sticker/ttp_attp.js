// ⚠️ معطّل مؤقتاً - مكتبة canvas مش مدعومة على السيرفر
const handler = async (m, { command }) => {
    m.reply(`*❌ أمر .${command} معطّل حالياً*\nالسبب: مكتبة الرسم مش مدعومة على السيرفر`);
};

handler.command = ['نص_ملصق', 'ttp', 'نص_ملصق_متحرك', 'attp'];
handler.category = 'sticker';

export default handler;
