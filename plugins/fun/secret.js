// رسائل سرية ورابط - حب_بالسر، رابطي
const handler = async (m, { conn, command }) => {
    if (command === 'حب_بالسر' || command === 'حب-بالسر') {
        const target = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!target) return m.reply('*📌 منشن الشخص اللي بتحبه*');
        try {
            await conn.sendMessage(target, {
                text: `💌 *رسالة سرية:*\n\nفي حد بيحبك في الجروب 😊❤️`
            });
            return m.reply(`*✅ تم إرسال رسالتك السرية! 💌*`);
        } catch { return m.reply('*❌ مش قادر أبعت الرسالة*'); }
    }
    if (command === 'رابطي') {
        return m.reply(`🔗 *رابط تواصلك:*\n\nhttps://wa.me/${m.sender.split('@')[0]}`);
    }
};
handler.usage    = ['حب_بالسر','رابطي'];
handler.category = 'fun';
handler.command  = ['حب_بالسر','حب-بالسر','رابطي'];
export default handler;
