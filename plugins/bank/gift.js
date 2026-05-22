const rewards = {
    daily: { xp: 500, cookies: 100, cooldown: 86400000, name: '☀️ يومي', icon: '🌅', border: '☀️' },
    weekly: { xp: 1300, cookies: 210, cooldown: 604800000, name: '📆 اسبوعي', icon: '🗓️', border: '📅' },
    monthly: { xp: 4500, cookies: 420, cooldown: 2592000000, name: '🌙 شهري', icon: '🌟', border: '🌙' }
};

const getTimeRemaining = (lastClaim, cooldown) => {
    const now = Date.now();
    const diff = lastClaim + cooldown - now;
    if (diff <= 0) return null;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    return { hours, minutes, seconds };
};

const formatTime = (time) => {
    if (!time) return '';
    const parts = [];
    if (time.hours > 0) parts.push(`${time.hours} ساعة`);
    if (time.minutes > 0) parts.push(`${time.minutes} دقيقة`);
    if (time.seconds > 0) parts.push(`${time.seconds} ثانية`);
    return parts.join(' و ');
};

const handler = async (m, { conn, command }) => {
    const type = command === 'يومي' ? 'daily' : command === 'اسبوعي' ? 'weekly' : 'monthly';
    const reward = rewards[type];
    
    if (!global.db?.users[m.sender]) {
        global.db.users[m.sender] = {};
    }
    
    const user = global.db.users[m.sender];
    if (!user.time) user.time = {};
    
    const lastClaim = user.time[type];
    const now = Date.now();
    
    if (lastClaim && (now - lastClaim) < reward.cooldown) {
        const remaining = getTimeRemaining(lastClaim, reward.cooldown);
        const timeLeft = formatTime(remaining);
        await m.reply(`*❌ انتظـر ${timeLeft} لاستلام الهدية ${reward.name}*`);
        return;
    }
    
    user.time[type] = now;
    user.xp = (user.xp || 0) + reward.xp;
    user.cookies = (user.cookies || 0) + reward.cookies;
    
    const profilePic = await conn.profilePictureUrl(m.sender, 'image').catch(() => 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg');
    
    const msg = `╭─┈─┈─┈─⟞${reward.border}⟝─┈─┈─┈─╮
┃ *🎁 هـديـة ${reward.name} 🎁*
╰─┈─┈─┈─⟞${reward.border}⟝─┈─┈─┈─╯

┃ @${m.sender.split('@')[0]}
┃ ✨ حصلت على:
┃ 🎉 +${reward.xp} نقطة خبرة
┃ 🍪 +${reward.cookies} كوكيز

╭─┈─┈─┈─⟞${reward.border}⟝─┈─┈─┈─╮
┃ *تـسـتـقـبـل هـديـتك الـقـادمـة بـعـد* 🚀
╰─┈─┈─┈─⟞✨⟝─┈─┈─┈─╯`;

    await conn.sendMessage(m.chat, {
        image: { url: profilePic },
        caption: msg,
        contextInfo: {
            mentionedJid: [m.sender],
            isForwarded: true,
            forwardingScore: 1,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363422581600030@newsletter',
                newsletterName: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
                serverMessageId: 0
            }
        }
    }, { quoted: reply_status });
};

handler.usage = ["يومي", "اسبوعي", "شهري"];
handler.category = "bank";
handler.command = ["يومي", "اسبوعي", "شهري"];

export default handler;