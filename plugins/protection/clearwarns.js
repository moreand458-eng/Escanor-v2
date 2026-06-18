// أمر مسح كل الإنذارات - clearwarns / مسح_الانذارات
import { getG, canUseAdminCmd } from '../../system/admin_utils.js';

const handler = async (m, { conn, bot }) => {
    if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');
    if (!canUseAdminCmd(m, bot, conn)) {
        return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*');
    }

    const g = getG(m.chat);
    g.warnings = {};
    return m.reply('✅ *تم مسح جميع الإنذارات*');
};

handler.command  = ['clearwarns', 'مسح_الانذارات'];
handler.usage    = ['clearwarns'];
handler.category = 'protection';

export default handler;
