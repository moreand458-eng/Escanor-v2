// أمر تحديد حد الإنذارات - setmax / حد_الانذارات
import { getG, canUseAdminCmd } from '../../system/admin_utils.js';

const handler = async (m, { conn, bot, text }) => {
    if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');
    if (!canUseAdminCmd(m, bot, conn)) {
        return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*');
    }

    const num = parseInt(text);
    if (!num || num < 1 || num > 10) return m.reply('*مثال:* .setmax 3');

    const g = getG(m.chat);
    g.maxWarnings = num;
    return m.reply(`✅ *تم تعيين حد الإنذارات: ${num}*`);
};

handler.command  = ['setmax', 'حد_الانذارات'];
handler.usage    = ['setmax'];
handler.category = 'protection';

export default handler;
