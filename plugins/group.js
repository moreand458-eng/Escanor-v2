const MAIN_OWNER_URL = 'https://wa.me/message/GS4F67GW4JCBK1';

const OWNER_INFO = `╭▬▭𝅼▬࣪▭▬࣪🧑‍💻▬▭▬▭▬╮\n┃ٌ╲.𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐞𝐫 𝐢𝐧𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐨𝐧╲ٌ‌┃\n╰▬▭𝅼▬࣪▭𝅼▬🧑‍💻▬ׄ▭▬࣪▭𝅼▬╯\n┃ٌ╲ ‌╲ .𝐄𝐒𝐂𝐀𝐍𝛩𝐑ٌ╲'╲ .╲╲ .┃\n┃Dev🧑‍💻:𝐄𝐒𝐂𝐀𝐍𝛩𝐑‌' ‌ ‌‌ ‌ ‌ ‌ ‌‌ ‌ ‌ ‌ ‌ ‌‌‌┃\n┃Age🤷‍♂️:𝟏𝟵' ‌‌ ‌ ‌ ‌‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌‌ ‌ ‌ ‌ ‌ ‌  ‌ ‌ ‌ ‌ ‌ ‌┃\n┃Exp 📊:𝟵𝟯% ‌‌ ‌ ‌ ‌ ‌‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌ ‌‌‌┃\n┃purp📑:Help everyone👥┃\n╰▬▭𝅼▬࣪▭𝅼▬ׄ🧑‍💻▬ׄ▭▬▭▬╯`;

// رسائل البوت - ديناميكية حسب اسم المطور
const makeOwnerBotMsgs = (ownerName) => [
    `تم استشعار المطور 👁‍🗨\nالنظام تحت أمرك يا سيد ${ownerName} 👑⚡`,
    `${ownerName} هنا 🕷️\nأوامرك يا معلم 👑`,
];

const handler = async (m, { conn, bot, command }) => {
    const owners = bot?.config?.owners || [];

    // جيب بيانات المطور اللي كتب الأمر لو موجود
    const ownerEntry = owners.find(o =>
        m.sender === o.jid || m.sender === o.lid
    );
    const isOwner = !!ownerEntry;
    const ownerName = ownerEntry?.name || '𝑬𝑺𝑪𝑨𝑵𝑶𝑹';

    if (command === 'بوت') {
        if (isOwner) {
            const msgs = makeOwnerBotMsgs(ownerName);
            return conn.sendMessage(m.chat, {
                text: msgs[Math.floor(Math.random() * msgs.length)]
            }, { quoted: m });
        }
        return conn.sendMessage(m.chat, {
            text: `أنا 𝐄𝐒𝐂𝐀𝐍𝛩𝐑… نادِني باسمي يا هذا ☠️`
        }, { quoted: m });
    }

    if (command === 'المطور' || command === 'مطور') {
        if (global.devStatus === 'closed') {
            return conn.sendMessage(m.chat, {
                text: `*المطور مش فاضي دلوقتي 🛡⚜️*`
            }, { quoted: m });
        }

        try {
            return conn.sendButton(m.chat, {
                imageUrl: 'https://i.postimg.cc/XJX2cRJc/0af18dd2b2543651464204773234c433.jpg',
                bodyText: OWNER_INFO,
                footerText: '𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT Developer',
                buttons: [
                    { name: 'cta_url', params: { display_text: '💬 تواصل مع المطور', url: MAIN_OWNER_URL } }
                ],
                mentions: [m.sender],
                newsletter: { name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐿 🕷️', jid: '120363422581600030@newsletter' },
                interactiveConfig: { buttons_limits: 1, list_title: '', button_title: '', canonical_url: MAIN_OWNER_URL }
            }, m);
        } catch {
            return conn.sendMessage(m.chat, {
                text: OWNER_INFO + `\n\n> للتواصل: ${MAIN_OWNER_URL}`
            }, { quoted: m });
        }
    }
};

handler.command = ['بوت', 'المطور', 'مطور'];
handler.usePrefix = false;

export default handler;
