const CATEGORIES = [
    [1,  'التـحـمـيـل',          'downloads', '📂'],
    [2,  'الـمـجـمـوعـات',       'group',     '👥'],
    [3,  'الـمـلـصـقـات',        'sticker',   '🌄'],
    [4,  'الـمـطـوريـن',         'owner',     '🇦🇱'],
    [5,  'امـثـلـه',             'example',   '✳️'],
    [6,  'الـادوات',             'tools',     '🛠'],
    [7,  'الـبـحـث',             'search',    '🌐'],
    [8,  'المشرفين',             'admins',    '🛡️'],
    [9,  'الالــعـاب',           'game',      '🎮'],
    [10, 'الچيف',                'gif',       '✴️'],
    [11, 'الـبــنـك',            'bank',      '🏛'],
    [12, 'الـذكـاء الاصـطـنـاعـي','ai',       '🤖'],
    [13, 'الـبـوتـات الـفـرعـي', 'sub',      '🕹'],
    [14, 'مـعـلومـات الـبـوت',   'info',      '🗃️'],
    [15, 'أخــرى',               'other',     '🌹'],
    [16, 'الـتـسـلـيـة',           'fun',       '🎊'],
    [17, 'الـديـن',               'religion',  '🕌'],
    [18, 'الحـمـايـة',             'protection','🛡️'],
    [19, 'الـنـقـابـات',           'guilds',    '🏰'],
    [20, 'الـتـطـويـر',           'dev',       '⚔️'],
    [21, 'الإعـدادات',            'settings',  '⚙️']
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
            if (c[2] === 'settings') return isOwner;
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

        // نظام الرتب
    // ── الرتبة والمستوى ──
    const _isOwner = bot.config.owners.some(o => m.sender === o.jid || m.sender === o.lid);
    const xp = global.db?.users?.[m.sender]?.xp || 0;
    const lvl = _isOwner ? 999 : (Math.floor(Math.sqrt(xp / 100)) + 1);
    const rank = _isOwner
        ? { n: 'رئيس', i: '👑' }
        : (() => {
            const ranksList = [
                {min:1,max:5,n:'مواطن',i:'👤'},{min:6,max:10,n:'جندي',i:'🪖'},
                {min:11,max:15,n:'عريف',i:'🎖️'},{min:16,max:20,n:'رقيب',i:'🎖️'},
                {min:21,max:25,n:'رقيب أول',i:'🎖️'},{min:26,max:30,n:'مساعد',i:'⭐'},
                {min:31,max:35,n:'مساعد أول',i:'⭐⭐'},{min:36,max:40,n:'ملازم',i:'🧑‍✈️'},
                {min:41,max:45,n:'ملازم أول',i:'🧑‍✈️'},{min:46,max:55,n:'نقيب',i:'👨‍✈️'},
                {min:56,max:65,n:'رائد',i:'👨‍✈️'},{min:66,max:75,n:'مقدم',i:'🏅'},
                {min:76,max:90,n:'عقيد',i:'🏅'},{min:91,max:110,n:'عميد',i:'🌟'},
                {min:111,max:130,n:'لواء',i:'🌟'},{min:131,max:160,n:'فريق',i:'⚜️'},
                {min:161,max:200,n:'فريق أول',i:'⚜️'},{min:201,max:Infinity,n:'مشير',i:'👑'}
            ];
            return ranksList.find(r => lvl >= r.min && lvl <= r.max) || ranksList[0];
        })();
    const totalUsers = Object.keys(global.db?.users || {}).length;

    const menuText = `━ ╼╃ ⌬〔﷽〕⌬ ╄╾ ━
> 〔  الأوامــر┊ ˼‏ 🧬˹ ↶〕
*⋅ ───━ •﹝📌﹞• ━─── ⋅*
╗───¤﹝معلومات المستخدم ↶ 🧰﹞
> •🪪┊الاسم: *${m.pushName || 'مجهول'}*
> •🆙┊مستواك: *Lv ${lvl}*
> •🧰┊الرتبة: *${rank.i} ${rank.n}*
╗───¤﹝معلومات البوت ↶ 🤖﹞
> •🎴┊اسم البوت: *𝐄𝐒𝐂𝐀𝐍𝛩𝐑 𝐕𝟐*
> •🔢┊عدد المستخدمين: *${totalUsers}*
> •👨🏻‍💻┊المطور: *𝐄𝐒𝐂𝐀𝐍𝛩𝐑*
> •🀄┊الرقم: wa.me/201092178171
╗───¤﹝معلومات عامه ↶ 📮﹞
> •🌥️┊اليوم: *${now.toLocaleDateString('ar-EG', { weekday: 'long' })}*
> •📆┊التاريخ: *${date}*
> •⏱️┊مدة التشغيل: *${uptimeFormatted}*
*⋅ ───━ •﹝📌﹞• ━─── ⋅*
> *_اختار قسم من القائمة 👇_*`;

        try {
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
        } catch {
            await conn.sendMessage(m.chat, { text: menuText, contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
        }
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

    try {
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
    } catch {
        await conn.sendMessage(m.chat, { text: bodyText, contextInfo: context(m.sender, getImg(bot)) }, { quoted: m });
    }
}

handler.command = ['اوامر'];
export default handler;