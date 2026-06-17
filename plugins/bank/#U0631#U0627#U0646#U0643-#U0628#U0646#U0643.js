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


const handler = async (m, { conn }) => {
    if (!m?.sender) return;
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات غير متاحة*');

    const users = Object.entries(global.db.users || {})
        .map(([id, u]) => ({ id, ...u }))
        .filter(u => (u.coins || 0) > 0)
        .sort((a, b) => (b.coins || 0) - (a.coins || 0))
        .slice(0, 10);

    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

    const list = users.length
        ? users.map((u, i) =>
            `┃ ${medals[i]} ${u.id.split('@')[0]} - ${formatNumber(u.coins)} 🪙`
          ).join('\n')
        : '┃ ❌ لا يوجد بيانات بعد';

    await conn.sendMessage(m.chat, {
        text:
            `╭─┈─┈─┈─⟞🏆⟝─┈─┈─┈─╮\n` +
            `┃ *أثرى الأعضاء 💰*\n` +
            `╰─┈─┈─┈─⟞✨⟝─┈─┈─┈─╯\n\n` +
            `${list}`
    }, { quoted: global.reply_status || m });
};

handler.usage    = ['رانك-بنك', 'rank', 'المتصدرين-بنك'];
handler.category = 'bank';
handler.command  = ['رانك-بنك', 'rank', 'المتصدرين-بنك'];

export default handler;
