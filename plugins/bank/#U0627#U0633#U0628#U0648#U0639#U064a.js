const WEEKLY_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

const formatNumber = (n) => Number(n || 0).toLocaleString('en');

const saveUser = (sender, data) => {
    if (!global.db?.users) return;
    global.db.users[sender] = Object.assign(global.db.users[sender] || {}, data);
};

const getUser = (sender) => {
    const u = global.db?.users?.[sender] || {};
    return {
        xp: Number(u.xp) || 0, coins: Number(u.coins) || 0,
        diamonds: Number(u.diamonds) || 0, dollars: Number(u.dollars) || 0,
        level: Number(u.level) || 0, msgcount: Number(u.msgcount) || 0, ...u
    };
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const handler = async (m, { conn }) => {
    if (!m?.sender) return;
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات غير متاحة*');

    const user = getUser(m.sender);
    const now = Date.now();
    const remaining = WEEKLY_COOLDOWN - (now - (user.lastWeekly || 0));

    if (remaining > 0) {
        const days  = Math.floor(remaining / 86400000);
        const hours = Math.floor((remaining % 86400000) / 3600000);
        return m.reply(`*⏰ انتظر ${days} يوم و${hours} ساعة للمكافأة الأسبوعية*`);
    }

    const amount = randomInt(5000, 15000);
    user.coins      = (user.coins || 0) + amount;
    user.lastWeekly = now;
    saveUser(m.sender, user);

    const pic = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg');

    await conn.sendMessage(m.chat, {
        image: { url: pic },
        caption:
            `╭─┈─┈─┈─⟞🎊⟝─┈─┈─┈─╮\n` +
            `┃ *📆 مكافأة أسبوعية*\n` +
            `╰─┈─┈─┈─⟞✨⟝─┈─┈─┈─╯\n\n` +
            `┃ @${m.sender.split('@')[0]}\n` +
            `┃ 🪙 +${formatNumber(amount)} ذهب\n` +
            `┃ 💳 رصيدك: ${formatNumber(user.coins)} 🪙\n\n` +
            `> _الهدية القادمة بعد 7 أيام_ 🚀`,
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: global.reply_status || m });
};

handler.usage    = ['مكافأة-اسبوعية', 'weekly-coins', 'مكافاة-اسبوعية'];
handler.category = 'bank';
handler.command  = ['مكافأة-اسبوعية', 'weekly-coins', 'مكافاة-اسبوعية'];
export default handler;
