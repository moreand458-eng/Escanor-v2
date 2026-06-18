// ارفعني - بيرفع المطور لادمن باستخدام updateParticipant الصح
import { updateParticipant } from '../../system/admin_utils.js';

const handler = async (m, { conn }) => {
    if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');
    if (!m.isBotAdmin) return m.reply('*❌ ارفع البوت ادمن الأول*');

    const res = await updateParticipant(m.chat, m.sender, 'promote', conn);
    if (res.ok) {
        return m.reply('*تم رفعك ادمن يا مطوري 🌹⁦(⁠≧▽≦⁠)⁩*');
    }
    return m.reply('*❌ مش قادر يرفعك - تأكد إن البوت ادمن*');
};

handler.usage    = ['ارفعني'];
handler.category = 'owner';
handler.command  = ['ارفعني'];
handler.owner    = true;
handler.botAdmin = true;

export default handler;
