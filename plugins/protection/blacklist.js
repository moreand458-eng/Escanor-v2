// نظام البلاك ليست - كلمات ممنوعة وأرقام ممنوعة
const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

const handler = async (m, { conn, command, text }) => {
    const g = getG(m.chat);
    if (!g.blacklist) g.blacklist = [];

    if (command === 'blacklist') {
        if (!text) {
            if (!g.blacklist.length) return m.reply('*📋 البلاك ليست فارغة*');
            return m.reply(`*🚫 الكلمات الممنوعة (${g.blacklist.length}):*\n\n${g.blacklist.map((w, i) => `${i+1}. ${w}`).join('\n')}`);
        }
        const [action, ...words] = text.trim().split(' ');
        const word = words.join(' ');

        if (action === 'add' || action === 'اضافه') {
            if (!word) return m.reply('*مثال:* .blacklist add كلمة');
            if (g.blacklist.includes(word)) return m.reply('*الكلمة موجودة بالفعل*');
            g.blacklist.push(word.toLowerCase());
            return m.reply(`✅ *تم إضافة "${word}" للبلاك ليست*`);
        }

        if (action === 'remove' || action === 'حذف') {
            if (!word) return m.reply('*مثال:* .blacklist remove كلمة');
            g.blacklist = g.blacklist.filter(w => w !== word.toLowerCase());
            return m.reply(`✅ *تم حذف "${word}" من البلاك ليست*`);
        }

        if (action === 'clear' || action === 'مسح') {
            g.blacklist = [];
            return m.reply('✅ *تم مسح البلاك ليست*');
        }
    }

    // حماية ضد نشر الأرقام
    if (command === 'anti-phone') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on') { g.antiPhone = true; return m.reply('✅ *تم تفعيل مضاد نشر الأرقام*'); }
        if (val === 'off') { delete g.antiPhone; return m.reply('✅ *تم إيقاف مضاد نشر الأرقام*'); }
        return m.reply(`حالة مضاد الأرقام: ${g.antiPhone ? '✅ مفعل' : '❌ مطفي'}`);
    }

    // مضاد التوجيه (forward)
    if (command === 'anti-forward') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on') { g.antiForward = true; return m.reply('✅ *تم تفعيل مضاد الإعادة*'); }
        if (val === 'off') { delete g.antiForward; return m.reply('✅ *تم إيقاف مضاد الإعادة*'); }
        return m.reply(`حالة مضاد الإعادة: ${g.antiForward ? '✅ مفعل' : '❌ مطفي'}`);
    }

    // مضاد الكلام (curse)
    if (command === 'anti-curse') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on') { g.antiCurse = true; return m.reply('✅ *تم تفعيل مضاد الشتيمة*'); }
        if (val === 'off') { delete g.antiCurse; return m.reply('✅ *تم إيقاف مضاد الشتيمة*'); }
        return m.reply(`حالة مضاد الشتيمة: ${g.antiCurse ? '✅ مفعل' : '❌ مطفي'}`);
    }

    // مضاد الفيضان (flood)
    if (command === 'anti-flood') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on') { g.antiFlood = true; return m.reply('✅ *تم تفعيل مضاد الرسائل الطويلة*'); }
        if (val === 'off') { delete g.antiFlood; return m.reply('✅ *تم إيقاف مضاد الرسائل الطويلة*'); }
        return m.reply(`حالة مضاد الفيضان: ${g.antiFlood ? '✅ مفعل' : '❌ مطفي'}`);
    }

    // وضع صارم
    if (command === 'strict') {
        const val = text?.trim()?.toLowerCase();
        if (val === 'on') { g.strictMode = true; return m.reply('✅ *تم تفعيل الوضع الصارم*\n⚡ أي مخالفة = طرد فوري'); }
        if (val === 'off') { delete g.strictMode; return m.reply('✅ *تم إيقاف الوضع الصارم*'); }
        return m.reply(`الوضع الصارم: ${g.strictMode ? '✅ مفعل' : '❌ مطفي'}`);
    }
};

// before hook للبلاك ليست
handler.before = async (m, { conn, bot }) => {
    if (!m.isGroup) return false;
    const isOwner = bot?.config?.owners?.some(o => m.sender === o.jid || m.sender === o.lid);
    if (isOwner || m.isAdmin) return false;

    const g = global._gs?.[m.chat] || {};
    const text = (m.text || m.body || '').toLowerCase();

    // كشف الكلمات الممنوعة
    if (g.blacklist?.length && text) {
        const found = g.blacklist.some(w => text.includes(w));
        if (found) {
            try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
            await conn.sendMessage(m.chat, {
                text: `🚫 @${m.sender.split('@')[0]} رسالتك تحتوي على كلمة ممنوعة`,
                mentions: [m.sender]
            });
            return true;
        }
    }

    // كشف نشر الأرقام
    if (g.antiPhone) {
        const phoneRegex = /(\+\d{7,15}|\b0\d{9,14}\b)/g;
        if (phoneRegex.test(text)) {
            try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
            await conn.sendMessage(m.chat, {
                text: `📵 @${m.sender.split('@')[0]} ممنوع نشر أرقام الهاتف`,
                mentions: [m.sender]
            });
            return true;
        }
    }

    // كشف الرسائل الموجهة (forward)
    if (g.antiForward && m.message?.extendedTextMessage?.contextInfo?.isForwarded) {
        try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}
        await conn.sendMessage(m.chat, {
            text: `↩️ @${m.sender.split('@')[0]} ممنوع إعادة توجيه الرسائل`,
            mentions: [m.sender]
        });
        return true;
    }

    return false;
};

handler.command  = [
    'blacklist', 'anti-phone', 'anti-forward',
    'anti-curse', 'anti-flood', 'strict'
];
handler.usage    = ['blacklist add/remove/clear', 'anti-phone on/off', 'strict on/off'];
handler.admin    = true;
handler.category = 'protection';
export default handler;
