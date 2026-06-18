// أمر فك الكتم - unmute / فك_كتم / فك-كتم / رفع_الكتم
import { getG, canUseAdminCmd, isInList, removeFromList } from '../../system/admin_utils.js';
import { adminGuard, checkCommandCooldown, notAuthMsg } from '../../system/bot_protection.js';

const handler = async (m, { conn, bot }) => {
    if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');
    
    await adminGuard(m, { conn, bot });
    
    const cooldown = checkCommandCooldown('unmute', m.sender, m.chat);
    if (!cooldown.allowed) return m.reply(`*⏳ استنى ${Math.ceil(cooldown.waitMs / 1000)} ثانية*`);
    
    if (!canUseAdminCmd(m, bot, conn)) {
        return m.reply(notAuthMsg());
    }

    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply('*منشن العضو أو رد على رسالته*');

    const g = getG(m.chat);

    if (!isInList(g.mute, target)) return conn.sendMessage(m.chat, {
        text: `*❌ @${target.split('@')[0]} غير مكتوم*`, mentions: [target]
    });

    g.mute = removeFromList(g.mute, target);

    return conn.sendMessage(m.chat, {
        text: `🔓 *تم فك كتم @${target.split('@')[0]}*\n✅ يمكنه الكلام الآن`,
        mentions: [target]
    }, { quoted: m });
};

handler.command  = ['unmute', 'فك_كتم', 'فك-كتم', 'رفع_الكتم'];
handler.usage    = ['unmute'];
handler.category = 'protection';

export default handler;
