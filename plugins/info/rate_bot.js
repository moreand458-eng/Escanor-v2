// rate_bot.js - تقييم البوت (.تقيم)
// مكنش موجود قبل كده، اتضاف عشان زرار "تقييم" في المنيو الجديد كان بيدوس على أمر مش موجود
const handler = async (m, { conn, bot, text }) => {
    if (!text || !text.trim()) {
        return m.reply('*⭐ اكتب رأيك في البوت بعد الأمر*\n\n📝 مثال:\n.تقيم البوت ولا اروع 🔥');
    }

    m.react('🌟');
    const ratingText = text.trim().slice(0, 300);

    // نخزن التقييم (مش بيانات حساسة، مجرد نص رأي العضو)
    if (!global.db.ratings) global.db.ratings = [];
    global.db.ratings.push({
        sender: m.sender,
        name: m.pushName || 'مجهول',
        text: ratingText,
        time: Date.now()
    });
    if (global.db.ratings.length > 500) global.db.ratings.shift();

    // نبعت نسخة للمطور الأساسي للبوت
    try {
        const owner = bot?.config?.owners?.[0];
        if (owner?.jid) {
            await conn.sendMessage(owner.jid, {
                text:
                    `🌟 *تقييم جديد للبوت*\n\n` +
                    `👤 *من:* ${m.pushName || 'مجهول'} (@${m.sender.split('@')[0]})\n` +
                    `💬 *التقييم:*\n${ratingText}`,
                mentions: [m.sender]
            });
        }
    } catch {}

    return m.reply('*✅ شكرًا لتقييمك، رأيك وصل للمطور 🌟*');
};

handler.usage = ['تقيم <رأيك في البوت>'];
handler.command = ['تقيم', 'تقييم', 'rate'];
handler.category = 'info';
export default handler;
