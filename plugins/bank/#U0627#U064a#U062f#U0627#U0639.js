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

const handler = async (m, { conn, text }) => {
    if (!m?.sender) return;
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات غير متاحة*');

    const amount = parseInt(text);
    if (!amount || amount <= 0) {
        return m.reply(`*❌ اكتب المبلغ*\nمثال: *.ايداع 500*`);
    }
    const user = getUser(m.sender);

    const bonus    = randomInt(1, 5);
    const total    = amount + bonus;
    user.coins     = (user.coins || 0) + total;
    saveUser(m.sender, user);

    const pic = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg');

    await conn.sendMessage(m.chat, {
        image: { url: pic },
        caption:
            `╭─┈─┈─┈─⟞💰⟝─┈─┈─┈─╮\n` +
            `┃ *تم الإيداع بنجاح*\n` +
            `╰─┈─┈─┈─⟞✅⟝─┈─┈─┈─╯\n\n` +
            `┃ @${m.sender.split('@')[0]}\n` +
            `┃ 💰 المودع: ${formatNumber(amount)} 🪙\n` +
            `┃ 🎁 بونص: +${bonus} 🪙\n` +
            `┃ 💳 رصيدك: ${formatNumber(user.coins)} 🪙`,
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: global.reply_status || m });
};

handler.usage    = ['ايداع', 'deposit'];
handler.category = 'bank';
handler.command  = ['ايداع', 'deposit'];

export default handler;
