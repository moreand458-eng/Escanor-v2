// تحكم في كل المضادات بأمر واحد
import { canUseAdminCmd } from '../../system/admin_utils.js';
import { adminGuard, notAuthMsg } from '../../system/bot_protection.js';

const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

const ANTI_MAP = {
    'anti-link':    'antiLink',
    'anti-spam':    'antiSpam',
    'anti-tag':     'antiTag',
    'anti-fake':    'antiFake',
    'anti-bot':     'antiBots',
    'anti-delete':  'antiDelete',
    'anti-edit':    'antiEdit',
    'anti-media':   'antiMedia',
    'anti-sticker': 'antiSticker',
    'anti-audio':   'antiAudio',
    'anti-contact': 'antiContact',
};

const handler = async (m, { conn, command, text, bot }) => {
    if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');

    await adminGuard(m, { conn, bot });
    if (!canUseAdminCmd(m, bot, conn)) return m.reply(notAuthMsg());

    const g = getG(m.chat);
    const key = ANTI_MAP[command];
    if (!key) return;

    const action = text?.trim()?.toLowerCase();
    if (!action) {
        const status = g[key] ? '✅ مفعل' : '❌ مطفي';
        return m.reply(`*${command}*\nالحالة: ${status}\n\nاستخدام:\n*.${command} on* للتفعيل\n*.${command} off* للإيقاف`);
    }

    if (action === 'on' || action === 'تشغيل') {
        g[key] = true;
        const names = {
            antiLink: '🔗 مضاد الروابط', antiSpam: '📢 مضاد الإزعاج',
            antiTag: '🏷️ مضاد المنشن الجماعي', antiFake: '📵 مضاد الأرقام الوهمية',
            antiBots: '🤖 مضاد البوتات', antiDelete: '🗑️ كشف الرسائل المحذوفة',
            antiEdit: '✏️ كشف التعديل', antiMedia: '🖼️ مضاد الميديا',
            antiSticker: '🎭 مضاد الستيكر', antiAudio: '🔉 مضاد الصوت',
            antiContact: '📇 مضاد جهات الاتصال'
        };
        return m.reply(`✅ *تم تفعيل ${names[key] || key}*`);
    }

    if (action === 'off' || action === 'إيقاف' || action === 'ايقاف') {
        delete g[key];
        return m.reply(`✅ *تم إيقاف ${key}*`);
    }

    return m.reply('*استخدام:* .anti-link on/off');
};

handler.command  = ['anti-link','anti-spam','anti-tag','anti-fake','anti-bot','anti-delete','anti-edit','anti-media','anti-sticker','anti-audio','anti-contact'];
handler.usage    = ['anti-link on/off'];
handler.admin    = true;
handler.category = 'protection';
export default handler;
