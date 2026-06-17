const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

const formatNumber = (n) => Number(n || 0).toLocaleString('en');

const saveUser = (sender, user) => {
    if (!global.db?.users) return;
    const current = global.db.users[sender] || {};
    Object.assign(current, user);
    global.db.users[sender] = current;
};

const getUser = (sender) => {
    if (!global.db?.users) return { xp: 0, coins: 0, diamonds: 0, dollars: 0, level: 0, msgcount: 0 };
    const u = global.db.users[sender] || {};
    return {
        xp: Number(u.xp) || 0,
        coins: Number(u.coins) || 0,
        diamonds: Number(u.diamonds) || 0,
        dollars: Number(u.dollars) || 0,
        level: Number(u.level) || 0,
        msgcount: Number(u.msgcount) || 0,
        ...u
    };
};

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const handler = async (m, { conn }) => {
    if (!m?.sender) return;
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات غير متاحة*');
    const user = getUser(m.sender);
    const now = Date.now();
    const last = user.lastDaily || 0;
    const remaining = DAILY_COOLDOWN - (now - last);

    if (remaining > 0) {
        const hours = Math.floor(remaining / 3600000);
        const mins  = Math.floor((remaining % 3600000) / 60000);
        return m.reply(`*⏰ انتظر ${hours} ساعة و${mins} دقيقة للمكافأة اليومية*`);
    }

    const amount = randomInt(500, 2000);
    user.coins    = (user.coins || 0) + amount;
    user.lastDaily = now;
    saveUser(m.sender, user);

    const pic = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg');

    await conn.sendMessage(m.chat, {
        image: { url: pic },
        caption:
            `╭─┈─┈─┈─⟞🎁⟝─┈─┈─┈─╮\n` +
            `┃ *☀️ مكافأة يومية*\n` +
            `╰─┈─┈─┈─⟞✨⟝─┈─┈─┈─╯\n\n` +
            `┃ @${m.sender.split('@')[0]}\n` +
            `┃ 🪙 +${formatNumber(amount)} ذهب\n` +
            `┃ 💳 رصيدك: ${formatNumber(user.coins)} 🪙\n\n` +
            `> _الهدية القادمة بعد 24 ساعة_ 🚀`,
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: global.reply_status || m });
};

handler.usage    = ['مكافأة-يومية', 'daily-coins', 'مكافاة-يومية'];
handler.category = 'bank';
handler.command  = ['مكافأة-يومية', 'daily-coins', 'مكافاة-يومية'];

export default handler;
