const SPIN_COOLDOWN = 6 * 60 * 60 * 1000;

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

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

const outcomes = [
    { emoji: '💎', text: 'ألماس!',      type: 'diamonds', amount: 10 },
    { emoji: '🪙', text: 'ذهب كبير!',   type: 'coins',    amount: 5000 },
    { emoji: '🪙', text: 'ذهب متوسط!',  type: 'coins',    amount: 2000 },
    { emoji: '🪙', text: 'ذهب صغير!',   type: 'coins',    amount: 500 },
    { emoji: '💵', text: 'دولار!',       type: 'dollars',  amount: 50 },
    { emoji: '❌', text: 'لا شيء',       type: 'none',     amount: 0 },
    { emoji: '😢', text: 'خسرت!',        type: 'lose',     amount: 500 },
];

const handler = async (m, { conn }) => {
    if (!m?.sender) return;
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات غير متاحة*');
    const user = getUser(m.sender);
    const now = Date.now();
    const remaining = SPIN_COOLDOWN - (now - (user.lastSpin || 0));

    if (remaining > 0) {
        const hours = Math.floor(remaining / 3600000);
        const mins  = Math.floor((remaining % 3600000) / 60000);
        return m.reply(`*⏰ انتظر ${hours} ساعة و${mins} دقيقة قبل الدوران مجدداً*`);
    }

    const spin = randomItem(outcomes);
    user.lastSpin = now;

    if (spin.type === 'coins')         user.coins    = (user.coins    || 0) + spin.amount;
    else if (spin.type === 'diamonds') user.diamonds = (user.diamonds || 0) + spin.amount;
    else if (spin.type === 'dollars')  user.dollars  = (user.dollars  || 0) + spin.amount;
    else if (spin.type === 'lose')     user.coins    = Math.max(0, (user.coins || 0) - spin.amount);
    saveUser(m.sender, user);

    const resultLine = spin.type === 'lose'
        ? `😢 خسرت ${formatNumber(spin.amount)} 🪙`
        : spin.type === 'none'
            ? '😅 حظاً أوفر المرة القادمة!'
            : `🎉 ربحت: ${formatNumber(spin.amount)} ${spin.type === 'diamonds' ? '💎' : spin.type === 'dollars' ? '$' : '🪙'}`;

    const pic = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg');

    await conn.sendMessage(m.chat, {
        image: { url: pic },
        caption:
            `╭─┈─┈─┈─⟞🎡⟝─┈─┈─┈─╮\n` +
            `┃ *عجلة الحظ 🎰*\n` +
            `╰─┈─┈─┈─⟞✨⟝─┈─┈─┈─╯\n\n` +
            `┃ @${m.sender.split('@')[0]}\n` +
            `┃ 🎰 تدور... تدور... تدور...\n` +
            `┃ ${spin.emoji} ${spin.text}\n` +
            `┃ 🎁 ${resultLine}\n` +
            `┃ 💳 رصيدك: ${formatNumber(user.coins)} 🪙`,
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: global.reply_status || m });
};

handler.usage    = ['عجلة-الحظ', 'عجله-الحظ', 'spin'];
handler.category = 'bank';
handler.command  = ['عجلة-الحظ', 'عجله-الحظ', 'spin'];

export default handler;
