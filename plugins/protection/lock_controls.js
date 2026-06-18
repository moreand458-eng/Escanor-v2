// قفل/فتح الجروب والرابط
const handler = async (m, { conn, command }) => {
    if (command === 'lock' || command === 'قفل_الجروب') {
        try {
            await conn.groupSettingUpdate(m.chat, 'announcement');
            return m.reply('🔒 *تم قفل الجروب*\nفقط الادمنية يمكنهم الإرسال');
        } catch { m.reply('*شِـوَف البَـوَت ادمـن الاوَل「🔥」*'); }
    }

    if (command === 'unlock' || command === 'فتح_الجروب') {
        try {
            await conn.groupSettingUpdate(m.chat, 'not_announcement');
            return m.reply('🔓 *تم فتح الجروب*\nالكل يمكنه الإرسال');
        } catch { m.reply('*شِـوَف البَـوَت ادمـن الاوَل「🔥」*'); }
    }

    if (command === 'lock-link' || command === 'قفل_الرابط') {
        try {
            await conn.groupSettingUpdate(m.chat, 'locked');
            return m.reply('🔒 *تم قفل رابط الجروب*');
        } catch { m.reply('*شِـوَف البَـوَت ادمـن الاوَل「🔥」*'); }
    }

    if (command === 'reset-link' || command === 'تجديد_الرابط') {
        try {
            await conn.groupRevokeInvite(m.chat);
            const code = await conn.groupInviteCode(m.chat);
            return conn.sendMessage(m.chat, {
                text: `🔄 *تم تجديد رابط الجروب*\n\nhttps://chat.whatsapp.com/${code}`
            }, { quoted: m });
        } catch { m.reply('*شِـوَف البَـوَت ادمـن الاوَل「🔥」*'); }
    }
};

handler.command  = ['lock', 'unlock', 'lock-link', 'reset-link', 'قفل_الجروب', 'فتح_الجروب', 'قفل_الرابط', 'تجديد_الرابط'];
handler.usage    = ['lock', 'unlock', 'lock-link', 'reset-link'];
handler.admin    = true;
handler.botAdmin = true;
handler.category = 'protection';
export default handler;
