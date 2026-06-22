// أمر الكتم - mute / كتم / صامت
import { getG, isOwnerFn, canUseAdminCmd, isInList } from '../../system/admin_utils.js';
import { adminGuard, checkCommandCooldown, notAuthMsg } from '../../system/bot_protection.js';
import { logAndDeleteMessage } from '../../system/content_control.js';

const handler = async (m, { conn, bot }) => {
    if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');
    
    await adminGuard(m, { conn, bot });
    
    const cooldown = checkCommandCooldown('mute', m.sender, m.chat);
    if (!cooldown.allowed) return m.reply(`*⏳ استنى ${Math.ceil(cooldown.waitMs / 1000)} ثانية*`);
    
    if (!canUseAdminCmd(m, bot, conn)) {
        return m.reply(notAuthMsg());
    }

    const target = m.mentionedJid?.[0] || m.quoted?.sender;
    if (!target) return m.reply('*منشن العضو أو رد على رسالته*');
    if (isOwnerFn(target, bot, conn)) return m.reply('*مـقِـدرش ا؏ـمـل مـيـوَت لمـطِـوَري「🔥」*');

    const g = getG(m.chat);
    if (!g.mute) g.mute = [];

    if (isInList(g.mute, target)) return conn.sendMessage(m.chat, {
        text: `*❌ @${target.split('@')[0]} مكتوم بالفعل*`, mentions: [target]
    });

    g.mute.push(target);
    return conn.sendMessage(m.chat, {
        text: `🔇 *تم كتم @${target.split('@')[0]}*\n🔒 لن يتمكن من إرسال رسائل`,
        mentions: [target]
    }, { quoted: m });
};

handler.command  = ['mute', 'كتم', 'صامت'];
handler.usage    = ['mute'];
handler.category = 'protection';

handler.before = async (m, { conn, bot }) => {
    if (!m.isGroup) return false;
    if (isOwnerFn(m.sender, bot, conn)) return false;

    const muteList = global._gs?.[m.chat]?.mute;
    if (!muteList?.length) return false;

    if (!isInList(muteList, m.sender)) return false;

    await logAndDeleteMessage(m, conn, 'مكتوم في الجروب 🔇');
    return true;
};

export default handler;
