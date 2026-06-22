import {
    getCatByNum, getImg,
    buildMainMenuMessage, buildSectionMenu, buildDevMenu
} from '../system/menu_builder.js';

const context = (jid, img) => ({
    mentionedJid: [jid],
    isForwarded: true,
    forwardingScore: 1,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363422581600030@newsletter',
        newsletterName: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
        serverMessageId: 0
    },
    externalAdReply: {
        title: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻👨🏻‍💻🔥 | 𝐁𝐨𝐭 𝐢𝐬 𝐛𝐮𝐢𝐥𝐭 𝐨𝐧 𝐭𝐡𝐞 𝐄𝐒/𝐄𝐒𝟏 𝐟𝐫𝐚𝐦𝐞𝐰𝐨𝐫𝐤",
        body: "𝚆𝚑𝚊𝚝𝚜𝙰𝚙𝚙 𝚋𝚘𝚝 𝚝𝚑𝚊𝚝 𝚒𝚜 𝚎𝚊𝚜𝚢 𝚝𝚘 𝚖𝚘𝚍𝚒𝚏𝚢 𝚊𝚗𝚍 𝚟𝚎𝚛𝚢 𝚏𝚊𝚜𝚝",
        thumbnailUrl: img,
        sourceUrl: '',
        mediaType: 1,
        renderLargerThumbnail: true
    }
});

async function handler(m, { conn, bot, command, args }) {
    try { await m.react('📜'); } catch {}

    const isOwner = bot.config.owners.some(o => m.sender === o.jid || m.sender === o.lid);
    const totalUsers = Object.keys(global.db?.users || {}).length;
    const arg0 = args[0];

    // ── القائمة الرئيسية ──
    if (!arg0) {
        const params = buildMainMenuMessage(m, bot, command, totalUsers, isOwner);
        try {
            await conn.sendButtonNormal(m.chat, params, global.reply_status);
        } catch {
            await conn.sendMessage(m.chat, { text: params.caption, contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
        }
        return;
    }

    // ── قائمة المطورين السريعة ──
    if (arg0 === 'dev') {
        if (!isOwner) {
            await conn.sendMessage(m.chat, { text: '*❌ القسم ده للمطورين فقط 🇦🇱*', contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
            return;
        }
        const params = buildDevMenu(bot, command);
        try {
            await conn.sendButtonNormal(m.chat, params, global.reply_status);
        } catch {
            await conn.sendMessage(m.chat, { text: params.caption, contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
        }
        return;
    }

    // ── قائمة قسم ──
    const selected = parseInt(arg0);
    const cat = getCatByNum(selected);
    if (!cat) {
        await conn.sendMessage(m.chat, { text: `*❌ اختار رقم صحيح أو اكتب .${command} لعرض الأقسام*`, contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
        return;
    }

    if ((cat[2] === 'owner' || cat[2] === 'settings') && !isOwner) {
        await conn.sendMessage(m.chat, { text: '*❌ القسم ده للمطورين فقط 🇦🇱*', contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
        return;
    }

    const cmds = await bot.getAllCommands();
    const categoryCmds = cmds.filter(c => c.category === cat[2]);

    if (!categoryCmds.length) {
        await conn.sendMessage(m.chat, { text: '*❌ القسم فاضي*', contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
        return;
    }

    const usageList = categoryCmds
        .filter(c => Array.isArray(c.usage) && c.usage.length > 0)
        .flatMap(c => c.usage)
        .filter(u => u && u !== 'undefined');

    const params = buildSectionMenu(bot, command, cat, usageList);
    try {
        await conn.sendButtonNormal(m.chat, params, global.reply_status);
    } catch {
        await conn.sendMessage(m.chat, { text: params.caption, contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
    }
}

handler.command = ['اوامر', 'المهام', 'menu'];
export default handler;
