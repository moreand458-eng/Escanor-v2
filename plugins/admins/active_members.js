// المتصلين - مين شايف الرسائل
const handler = async (m, { conn }) => {
    try {
        const meta = await conn.groupMetadata(m.chat);
        const total = meta.participants.length;
        const admins = meta.participants.filter(p => p.admin).map(p => `@${p.id.split('@')[0]}`).join(' ');

        await conn.sendMessage(m.chat, {
            text:
                `👥 *معلومات الأعضاء*\n\n` +
                `📊 إجمالي الأعضاء: *${total}*\n` +
                `👑 الادمنية: ${admins || 'لا يوجد'}\n\n` +
                `> _هذه المعلومات لحظية_`,
            mentions: meta.participants.filter(p => p.admin).map(p => p.id)
        }, { quoted: m });
    } catch {
        m.reply('*❌ تعذر جلب البيانات*');
    }
};
handler.command  = ['المتصلين', 'الاعضاء'];
handler.usage    = ['المتصلين'];
handler.admin    = true;
handler.category = 'admins';
export default handler;
