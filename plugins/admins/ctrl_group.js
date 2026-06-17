// أمر قفل وفتح الجروب
import { adminGuard, checkCommandCooldown, notAdminMsg } from '../../system/bot_protection.js';

const handler = async (m, { conn, command, bot }) => {
  if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');
  
  // Live check: تحديث الـ isBotAdmin من جديد
  await adminGuard(m, { conn, bot });
  
  // فحص cooldown
  const cooldown = checkCommandCooldown(command, m.sender, m.chat);
  if (!cooldown.allowed) {
    return m.reply(`*⏳ استنى ${Math.ceil(cooldown.waitMs / 1000)} ثانية*`);
  }
  
  if (!m.isBotAdmin) return m.reply(notAdminMsg());
  if (!m.isAdmin) return m.reply('*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*');
  
  try {
    if (command === "قفل") {
      await conn.groupSettingUpdate(m.chat, 'announcement');
      m.reply('🔒 *تم قفل الشات* 🔒');
    } else if (command === "فتح") {
      await conn.groupSettingUpdate(m.chat, 'not_announcement');
      m.reply('🔓 *تم فتح الشات* 🔓');
    }
  } catch (e) {
    m.reply(`*❌ خطأ: ${e.message || 'فشل تنفيذ الأمر'}*`);
  }
};

handler.usage = ["قفل", "فتح"];
handler.category = "admins";
handler.command = ["قفل", "فتح"];
handler.admin = true;
handler.botAdmin = true;

export default handler;