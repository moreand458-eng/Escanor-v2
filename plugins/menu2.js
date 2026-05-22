const CATEGORIES = [
    [1,  'التـحـمـيـل',          'downloads', '📂'],
    [2,  'الـمـجـمـوعـات',       'group',     '👥'],
    [3,  'الـمـلـصـقـات',        'sticker',   '🌄'],
    [4,  'الـمـطـوريـن',         'owner',     '🇦🇱'],
    [5,  'امـثـلـه',             'example',   '✳️'],
    [6,  'الـادوات',             'tools',     '🛠'],
    [7,  'الـبـحـث',             'search',    '🌐'],
    [8,  'الادمــن',             'admins',    '👨🏻‍⚖️'],
    [9,  'الالــعـاب',           'game',      '🎮'],
    [10, 'الچيف',                'gif',       '✴️'],
    [11, 'الـبــنـك',            'bank',      '🏛'],
    [12, 'الـذكـاء الاصـطـنـاعـي','ai',       '🤖'],
    [13, 'الـبـوتـات الـفـرعـي', 'subs',      '🕹'],
    [14, 'مـعـلومـات الـبـوت',   'info',      '🗃️'],
    [15, 'أخــرى',               'other',     '🌹']
];

const getCat = n => CATEGORIES.find(c => c[0] === n);

const getImg = (bot) => {
    const { images } = bot.config.info;
    return Array.isArray(images) ? images[Math.floor(Math.random() * images.length)] : images;
};

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
    const selected = parseInt(args[0]);
    const now = new Date();
    const uptimeSeconds = process.uptime();
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = Math.floor(uptimeSeconds % 60);
    const uptimeFormatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const isOwner = bot.config.owners.some(o =>
        m.sender === o.jid || m.sender === o.lid
    );

    // ── القائمة الرئيسية ──
    if (!selected && !args[0]) {
        const visibleCats = CATEGORIES.filter(c => {
            if (c[2] === 'owner') return isOwner;
            return true;
        });

        const sections = [{
            title: "🌳 ~ الاقـسـام ~ 🪾",
            rows: visibleCats.map(c => ({
                title: `${c[3]} ${c[1]}`,
                description: `اضغط لعرض أوامر قسم ${c[1]}`,
                id: `.${command} ${c[0]}`
            }))
        }];

        const menuText = `╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊@${m.sender.split('@')[0]}⌉
── • ◈ • ──
*⌝🤖┊${bot?.config?.info?.nameBot || '𝐄𝐒𝐂𝐍𝐎𝐑 𝐁𝐎𝐓'}┊🤖⌞*
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹𝐄𝐒𝐂𝐍𝐎𝐑 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
> │┊ ۬.͜ـ🌙˖ ⟨الاسم: ${bot?.config?.info?.nameBot || '𝐄𝐒𝐂𝐍𝐎𝐑 𝐁𝐎𝐓'}☇
> │┊ ۬.͜ـ👑˖ ⟨المطور: ⌗𝐄𝐒𝐂𝐀𝐍𝛩𝐑☇
> │┊ ۬.͜ـ🚀˖ ⟨التشغيل: ${uptimeFormatted}☇
> │┊ ۬.͜ـ🗓˖ ⟨التاريخ: ${date}☇
> │┊ ۬.͜ـ⏰˖ ⟨الوقت: ${time}☇
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ─๋︩︪─═⊐‹𝐄𝐒𝐂𝐍𝐎𝐑 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─⊰ـ
> *_اختار قسم من القائمة 👇_*`;

        await conn.sendButtonNormal(m.chat, {
            media: { url: "https://i.postimg.cc/NMLN73FQ/328bf8cccafe63879d903f2b99d835a0.jpg" },
            mediaType: 'image',
            caption: menuText,
            buttons: [{
                name: "single_select",
                params: {
                    title: "L┆ قـسـم الأوامـر ┆ꓶ",
                    sections: sections
                }
            }],
            mentions: [m.sender],
            newsletter: {
                name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
                jid: '120363422581600030@newsletter'
            }
        }, global.reply_status);
        return;
    }

    // ── قائمة القسم ──
    const cat = getCat(selected);
    if (!cat) {
        await conn.sendMessage(m.chat, { text: '*❌ اختار رقم صحيح من 1 لـ 15*', contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
        return;
    }

    if (cat[2] === 'owner' && !isOwner) {
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

    // ── عرض الأوامر كـ قائمة منسدلة مع زر ──
    const rows = usageList.map(u => ({
        title: `${cat[3]} ${u}`,
        description: `اضغط لتشغيل الأمر`,
        id: `.${u}`
    }));

    const bodyText = `╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊@${m.sender.split('@')[0]}⌉
── • ◈ • ──
*⌝${cat[3]}┊قـائـمـة ${cat[1]}┊${cat[3]}⌞*
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹${bot?.config?.info?.nameBot || '𝐄𝐒𝐂𝐍𝐎𝐑 𝐁𝐎𝐓'}›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
${usageList.map(u => `> │┊ ۬.͜ـ${cat[3]}˖ ⟨${u}☇`).join('\n')}
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊐‹${bot?.config?.info?.nameBot || '𝐄𝐒𝐂𝐍𝐎𝐑 𝐁𝐎𝐓'}›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
> *صل علي النبي 🌺*`;

    await conn.sendButtonNormal(m.chat, {
        media: { url: getImg(bot) || "https://i.postimg.cc/NMLN73FQ/328bf8cccafe63879d903f2b99d835a0.jpg" },
        mediaType: 'image',
        caption: bodyText,
        buttons: [
            {
                name: "single_select",
                params: {
                    title: `${cat[3]}┆ أوامر ${cat[1]} ┆${cat[3]}`,
                    sections: [{
                        title: `❪${cat[3]}┊${cat[1]}┊${cat[3]}❫`,
                        rows: rows
                    }]
                }
            },
            {
                name: "quick_reply",
                params: {
                    display_text: '🔙 الرئيسية',
                    id: `.${command}`
                }
            }
        ],
        mentions: [m.sender],
        newsletter: {
            name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
            jid: '120363422581600030@newsletter'
        }
    }, global.reply_status);
}

handler.command = ['اوامر'];
export default handler;
