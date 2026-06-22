// أمر المضاربة - مخاطرة فورية بمبلغ يحدده المستخدم (ربح أو خسارة فورية)
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

const MIN_BET = 50;
const MAX_BET = 50_000;
const COOLDOWN = 5 * 60 * 1000; // 5 دقايق بين كل مضاربة

// نتائج المضاربة - احتمالات مختلفة (متوسط الاحتمال يميل بسيط لصالح البوت كأي نظام مخاطرة)
const OUTCOMES = [
    { chance: 0.05, mult: 3.0,  label: '🎉 ضربة كبيرة! x3' },
    { chance: 0.15, mult: 1.8,  label: '📈 صفقة رابحة! x1.8' },
    { chance: 0.20, mult: 1.3,  label: '✅ ربح بسيط x1.3' },
    { chance: 0.20, mult: 0,    label: '😐 السوق راكد - رجع فلوسك' },
    { chance: 0.25, mult: -0.5, label: '📉 خسارة جزئية' },
    { chance: 0.15, mult: -1.0, label: '💥 خسرت الكل!' },
];

const rollOutcome = () => {
    const r = Math.random();
    let acc = 0;
    for (const o of OUTCOMES) {
        acc += o.chance;
        if (r <= acc) return o;
    }
    return OUTCOMES[OUTCOMES.length - 1];
};

const handler = async (m, { conn, text }) => {
    if (!m?.sender) return;
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات غير متاحة*');

    const user = getUser(m.sender);
    const now = Date.now();
    const remaining = COOLDOWN - (now - (user.lastTrade || 0));

    if (remaining > 0) {
        const mins = Math.ceil(remaining / 60000);
        return m.reply(`*⏰ استنى ${mins} دقيقة قبل المضاربة تاني*`);
    }

    const arg = (text || '').trim().toLowerCase();
    let amount;

    if (arg === 'الكل' || arg === 'all') {
        amount = user.coins || 0;
    } else {
        amount = parseInt(arg);
    }

    if (!amount || amount < MIN_BET) {
        return m.reply(
            `*❌ حدد مبلغ المضاربة*\n` +
            `الحد الأدنى: ${formatNumber(MIN_BET)} 🪙\n` +
            `الحد الأقصى: ${formatNumber(MAX_BET)} 🪙\n\n` +
            `مثال: *.مضاربة 1000*\nأو: *.مضاربة الكل*`
        );
    }
    if (amount > MAX_BET) {
        return m.reply(`*❌ أقصى مبلغ للمضاربة ${formatNumber(MAX_BET)} 🪙*`);
    }
    if ((user.coins || 0) < amount) {
        return m.reply(`*❌ رصيدك غير كافٍ!*\n💳 رصيدك: ${formatNumber(user.coins)} 🪙`);
    }

    const outcome = rollOutcome();
    const change  = Math.round(amount * outcome.mult);

    user.coins    = Math.max(0, (user.coins || 0) + change);
    user.lastTrade = now;
    saveUser(m.sender, user);

    const resultLine = change > 0
        ? `🟢 ربحت ${formatNumber(change)} 🪙`
        : change < 0
            ? `🔴 خسرت ${formatNumber(Math.abs(change))} 🪙`
            : `⚪ ولا ربح ولا خسارة`;

    const pic = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg');

    await conn.sendMessage(m.chat, {
        image: { url: pic },
        caption:
            `╭─┈─┈─┈─⟞📊⟝─┈─┈─┈─╮\n` +
            `┃ *مضاربة فلوس 💹*\n` +
            `╰─┈─┈─┈─⟞⚡⟝─┈─┈─┈─╯\n\n` +
            `┃ @${m.sender.split('@')[0]}\n` +
            `┃ 💰 رأس المال: ${formatNumber(amount)} 🪙\n` +
            `┃ ${outcome.label}\n` +
            `┃ ${resultLine}\n` +
            `┃ 💳 رصيدك الآن: ${formatNumber(user.coins)} 🪙`,
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: m });
};

handler.usage    = ['مضاربة <مبلغ>', 'مضاربة الكل'];
handler.category = 'bank';
handler.command  = ['مضاربة', 'trade'];

export default handler;
