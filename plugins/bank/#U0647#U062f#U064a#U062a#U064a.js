const GIFT_COOLDOWN = 8 * 60 * 60 * 1000;

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
    const remaining = GIFT_COOLDOWN - (now - (user.lastGift || 0));

    if (remaining > 0) {
        const hours = Math.floor(remaining / 3600000);
        const mins  = Math.floor((remaining % 3600000) / 60000);
        return m.reply(`*⏰ انتظر ${hours} ساعة و${mins} دقيقة للهدية التالية*`);
    }

    const gifts = [
        { text: 'ذهب',   type: 'coins',    amount: randomInt(1000, 5000) },
        { text: 'ألماس', type: 'diamonds', amount: randomInt(5, 20) },
        { text: 'دولار', type: 'dollars',  amount: randomInt(10, 50) },
    ];
    const gift = gifts[randomInt(0, gifts.length - 1)];

    if (gift.type === 'coins')         user.coins    = (user.coins    || 0) + gift.amount;
    else if (gift.type === 'diamonds') user.diamonds = (user.diamonds || 0) + gift.amount;
    else if (gift.type === 'dollars')  user.dollars  = (user.dollars  || 0) + gift.amount;
    user.lastGift = now;
    saveUser(m.sender, user);

    const pic = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg');

    await conn.sendMessage(m.chat, {
        image: { url: pic },
        caption:
            `╭─┈─┈─┈─⟞🎁⟝─┈─┈─┈─╮\n` +
            `┃ *🎁 هديتك اليوم*\n` +
            `╰─┈─┈─┈─⟞✨⟝─┈─┈─┈─╯\n\n` +
            `┃ @${m.sender.split('@')[0]}\n` +
            `┃ 🎉 حصلت على ${formatNumber(gift.amount)} ${gift.text}!\n` +
            `┃ 🪙 رصيدك: ${formatNumber(user.coins)} 🪙\n\n` +
            `> _الهدية القادمة بعد 8 ساعات_ 🚀`,
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: global.reply_status || m });
};

handler.usage    = ['هديتي', 'gift', 'هدية'];
handler.category = 'bank';
handler.command  = ['هديتي', 'gift', 'هدية'];

export default handler;
