// مخفي - إرسال رسالة مجهولة للجروب
const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*مثال:* .مخفي نص الرسالة');
    try {
        await conn.sendMessage(m.chat, { delete: m.key });
    } catch {}
    await conn.sendMessage(m.chat, {
        text: `👤 *رسالة مجهولة:*\n\n${text}`
    });
};
handler.command  = ['مخفي'];
handler.usage    = ['مخفي'];
handler.admin    = true;
handler.category = 'admins';
export default handler;
