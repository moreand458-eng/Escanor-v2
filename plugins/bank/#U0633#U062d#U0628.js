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

const handler = async (m, { conn, text }) => {
    if (!m?.sender) return;
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات غير متاحة*');

    const amount = parseInt(text);
    if (!amount || amount <= 0) {
        return m.reply(`*❌ اكتب المبلغ*\nمثال: *.سحب 500*`);
    }

    const user = getUser(m.sender);
    if ((user.coins || 0) < amount) {
        return m.reply(`*❌ رصيدك غير كافٍ!*\n💳 رصيدك: ${formatNumber(user.coins)} 🪙`);
    }

    user.coins = (user.coins || 0) - amount;
    saveUser(m.sender, user);

    const pic = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg');

    await conn.sendMessage(m.chat, {
        image: { url: pic },
        caption:
            `╭─┈─┈─┈─⟞💸⟝─┈─┈─┈─╮\n` +
            `┃ *تم السحب بنجاح*\n` +
            `╰─┈─┈─┈─⟞✅⟝─┈─┈─┈─╯\n\n` +
            `┃ @${m.sender.split('@')[0]}\n` +
            `┃ 💸 المسحوب: ${formatNumber(amount)} 🪙\n` +
            `┃ 💳 المتبقي: ${formatNumber(user.coins)} 🪙`,
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: global.reply_status || m });
};

handler.usage    = ['سحب', 'withdraw'];
handler.category = 'bank';
handler.command  = ['سحب', 'withdraw'];
export default handler;
