

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
const handler = async (m, { conn, text }) => {
    if (!m?.sender) return;
    if (!global.db?.users) return m.reply('*❌ قاعدة البيانات غير متاحة*');
    const user = getUser(m.sender);

    if (user.registered) {
        return m.reply(
            `╭─┈─┈─┈─⟞✅⟝─┈─┈─┈─╮\n` +
            `┃ *أنت مسجل بالفعل!*\n` +
            `╰─┈─┈─┈─⟞📝⟝─┈─┈─┈─╯\n\n` +
            `┃ 🏷️ اسمك: ${user.registerName}`
        );
    }

    const name = text?.trim();
    if (!name) {
        return m.reply(
            `*📝 طريقة التسجيل في البنك:*\n\n` +
            `*.تسجيل-بنك الاسم*\n\n` +
            `مثال:\n*.تسجيل-بنك إسكانور*`
        );
    }

    user.registered   = true;
    user.registerName = name;
    user.coins        = (user.coins || 0) + 1000;
    saveUser(m.sender, user);

    const pic = await conn.profilePictureUrl(m.sender, 'image')
        .catch(() => 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg');

    await conn.sendMessage(m.chat, {
        image: { url: pic },
        caption:
            `╭─┈─┈─┈─⟞✅⟝─┈─┈─┈─╮\n` +
            `┃ *تم التسجيل في البنك بنجاح*\n` +
            `╰─┈─┈─┈─⟞🎉⟝─┈─┈─┈─╯\n\n` +
            `┃ @${m.sender.split('@')[0]}\n` +
            `┃ 👤 الاسم: ${name}\n` +
            `┃ 🎁 هدية تسجيل: 1000 ذهب 🪙`,
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: global.reply_status || m });
};

handler.usage    = ['تسجيل-بنك', 'register'];
handler.category = 'bank';
handler.command  = ['تسجيل-بنك', 'register'];

export default handler;
