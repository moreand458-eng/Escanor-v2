import { getRank, getLevel, getXpProgress } from '../../system/ranks.js';

const getU = (id) => {
    if (!global._userData) global._userData = {};
    if (!global._userData[id]) global._userData[id] = {};
    return global._userData[id];
};

// نحسب الرسائل
if (!global._msgCount) global._msgCount = {};

const handler = async (m, { conn, command }) => {

    if (command === 'رسايلي') {
        const count = global._msgCount?.[m.chat]?.[m.sender] || 0;
        const ud = getU(m.sender);
        return m.reply(
            `📊 *إحصائياتك في هذا الجروب*\n\n` +
            `💬 الرسائل: *${count}*\n` +
            `🏆 اللقب: *${ud.title || 'بدون لقب'}*`
        );
    }

    if (command === 'اجمالي') {
        const xp  = global.db?.users?.[m.sender]?.xp || 0;
        const lvl = getLevel(xp);
        const rank = getRank(lvl);
        const progress = getXpProgress(xp);
        const ud = getU(m.sender);

        return m.reply(
            `╗───¤﹝إجمالي ${m.pushName} ↶ 🧰﹞\n` +
            `> •🆙┊المستوى: *Lv ${lvl}*\n` +
            `> •${rank.icon}┊الرتبة: *${rank.name}*\n` +
            `> •✨┊XP: *${xp}*\n` +
            `> •📊┊التقدم: ${progress.bar} ${progress.percent}%\n` +
            `> •🏆┊اللقب: *${ud.title || 'بدون لقب'}*`
        );
    }

    if (command === 'رتبتي') {
        const xp  = global.db?.users?.[m.sender]?.xp || 0;
        const lvl = getLevel(xp);
        const rank = getRank(lvl);
        const progress = getXpProgress(xp);

        return m.reply(
            `${rank.icon} *رتبتك: ${rank.name}*\n\n` +
            `🆙 المستوى: *Lv ${lvl}*\n` +
            `📊 التقدم: *${progress.bar}* ${progress.percent}%\n` +
            `✨ XP الحالي: *${xp}*\n` +
            `🎯 XP للمستوى القادم: *${progress.needed - progress.progress}*`
        );
    }

    if (command === 'المتصدرين') {
        const users = global.db?.users || {};
        const list = Object.entries(users)
            .map(([id, u]) => ({ id, xp: u.xp || 0, lvl: getLevel(u.xp || 0) }))
            .sort((a, b) => b.xp - a.xp)
            .slice(0, 10);

        if (!list.length) return m.reply('*لا يوجد بيانات بعد*');

        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        const text = list.map((u, i) => {
            const rank = getRank(u.lvl);
            return `${medals[i]} @${u.id.split('@')[0]} │ Lv${u.lvl} │ ${rank.icon}${rank.name} │ ${u.xp}XP`;
        }).join('\n');

        return conn.sendMessage(m.chat, {
            text: `🏆 *المتصدرين (Top 10):*\n\n${text}`,
            mentions: list.map(u => u.id)
        }, { quoted: m });
    }
};

// عد الرسائل
handler.before = async (m, { conn }) => {
    if (!m.isGroup || !m.text) return false;
    if (!global._msgCount) global._msgCount = {};
    if (!global._msgCount[m.chat]) global._msgCount[m.chat] = {};
    global._msgCount[m.chat][m.sender] = (global._msgCount[m.chat][m.sender] || 0) + 1;

    // أضف XP كل 5 رسائل
    const count = global._msgCount[m.chat][m.sender];
    if (count % 5 === 0) {
        try {
            if (global.db?.users?.[m.sender]) {
                global.db.users[m.sender].xp = (global.db.users[m.sender].xp || 0) + 10;
            }
        } catch {}
    }
    return false;
};

handler.command  = ['رسايلي', 'اجمالي', 'رتبتي', 'المتصدرين'];
handler.usage    = ['رسايلي', 'اجمالي', 'رتبتي', 'المتصدرين'];
handler.category = 'guilds';
export default handler;
