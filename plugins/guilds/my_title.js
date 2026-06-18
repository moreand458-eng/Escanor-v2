const getU = (id) => {
    if (!global._userData) global._userData = {};
    if (!global._userData[id]) global._userData[id] = {};
    return global._userData[id];
};

const handler = async (m, { conn, command, text }) => {

    if (command === 'لقبي') {
        const ud = getU(m.sender);
        if (!ud.title) return m.reply('*❌ ليس لديك لقب بعد*\nاطلب من الادمن: *.تلقيب @أنت لقبك*');
        return m.reply(`🏆 *لقبك:* ${ud.title}`);
    }

    if (command === 'لقبه') {
        const target = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!target) return m.reply('*منشن الشخص*');
        const ud = getU(target);
        if (!ud.title) return conn.sendMessage(m.chat, {
            text: `*❌ @${target.split('@')[0]} ليس له لقب*`,
            mentions: [target]
        });
        return conn.sendMessage(m.chat, {
            text: `🏰 *لقب @${target.split('@')[0]}:* ${ud.title}`,
            mentions: [target]
        }, { quoted: m });
    }

    if (command === 'حذف_لقب') {
        const target = m.mentionedJid?.[0] || m.quoted?.sender || m.sender;
        const ud = getU(target);
        if (!ud.title) return m.reply('*❌ لا يوجد لقب*');
        const oldTitle = ud.title;
        delete ud.title;
        // إلغاء الحجز برضو
        if (global._reservedTitles) {
            const key = oldTitle.toLowerCase();
            if (global._reservedTitles[key] === target) delete global._reservedTitles[key];
        }
        return conn.sendMessage(m.chat, {
            text: `✅ *تم حذف لقب @${target.split('@')[0]}*`,
            mentions: [target]
        }, { quoted: m });
    }

    if (command === 'حذف_الألقاب' || command === 'حذف_الالقاب') {
        if (!m.isOwner) return m.reply('*❌ للمطور فقط*');
        const count = Object.values(global._userData || {}).filter(u => u.title).length;
        for (const ud of Object.values(global._userData || {})) delete ud.title;
        global._reservedTitles = {};
        return m.reply(`✅ *تم حذف ${count} لقب*`);
    }
};

handler.command  = ['لقبي', 'لقبه', 'حذف_لقب', 'حذف_الألقاب', 'حذف_الالقاب'];
handler.usage    = ['لقبي', 'لقبه', 'حذف_لقب'];
handler.category = 'guilds';
export default handler;
