// menu_builder.js - ستايل المنيو الجديد (بوردرز/إيموجيز مختلفة عن menu2.js الأساسي)
// ملحوظة: بيستخدم نفس آلية الإرسال المثبتة بالفعل في المشروع (conn.sendButtonNormal
// مع buttons: [{name, params}]) مش الشكل الخام (viewOnceMessage/interactiveMessage)
// لأن الـ conn هنا اتأكد إنه مش بياخد الشكل الخام مباشرة في أي مكان تاني بالمشروع.
import { getLevel, getRank } from './ranks.js';

export const CATEGORIES = [
    [1,  'التـحـمـيـل',           'downloads',  '📂'],
    [2,  'الـمـجـمـوعـات',        'group',      '👥'],
    [3,  'الـمـلـصـقـات',         'sticker',    '🌄'],
    [4,  'الـمـطـوريـن',          'owner',      '🇦🇱'],
    [5,  'امـثـلـه',              'example',    '✳️'],
    [6,  'الـادوات',              'tools',      '🛠'],
    [7,  'الـبـحـث',              'search',     '🌐'],
    [8,  'المشرفين',              'admins',     '🛡️'],
    [9,  'الالــعـاب',            'game',       '🎮'],
    [10, 'الچيف',                 'gif',        '✴️'],
    [11, 'الـبــنـك',             'bank',       '🏛'],
    [12, 'الـذكـاء الاصـطـنـاعـي','ai',         '🤖'],
    [13, 'الـبـوتـات الـفـرعـي',  'sub',        '🕹'],
    [14, 'مـعـلومـات الـبـوت',    'info',       '🗃️'],
    [15, 'الـتـسـلـيـة',          'fun',        '🎊'],
    [16, 'الـديـن',               'religion',   '🕌'],
    [17, 'الحـمـايـة',            'protection', '🛡️'],
    [18, 'الـنـقـابـات',          'guilds',     '🏰'],
    [19, '𝐄𝐒𝐂𝐀𝐍𝛩𝐑 𝐂𝐥𝐚𝐜𝐡',         'esclach',    '⚔️'],
    [20, 'الإعـدادات',            'settings',   '⚙️'],
    [21, 'الـوجـوهـات',           'logos',      '🔖'],
    [22, 'تـغـيـيـر الأصـوات',     'voices',     '🎙️'],
    [23, 'الأخـبـار',             'news',       '📰']
];

const DEFAULT_IMG = 'https://i.postimg.cc/NMLN73FQ/328bf8cccafe63879d903f2b99d835a0.jpg';
const NEWSLETTER = { name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️', jid: '120363422581600030@newsletter' };
const CHANNEL_LINK = 'https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f';
const OWNER_LINK = 'https://wa.me/message/GS4F67GW4JCBK1';

export const getCat = (key) => CATEGORIES.find(c => c[2] === key);
export const getCatByNum = (n) => CATEGORIES.find(c => c[0] === n);

export const getImg = (bot) => {
    const { images } = bot?.config?.info || {};
    if (Array.isArray(images) && images.length) return images[Math.floor(Math.random() * images.length)];
    return images || DEFAULT_IMG;
};

export const getBotName = (bot) => bot?.config?.info?.nameBot || '𝐄𝐒𝐂𝐍𝐎𝐑 𝐁𝐎𝐓';

// ===== صلاحيات المستخدم (مستوى/رتبة) =====
export const getUserInfo = (sender, isOwner) => {
    if (isOwner) return { level: 999, role: '👑 رئيس' };
    const xp = global.db?.users?.[sender]?.xp || 0;
    const level = getLevel(xp);
    const rank = getRank(level);
    return { level, role: `${rank.icon} ${rank.name}` };
};

// ===== الأقسام المتاحة حسب صلاحية المستخدم =====
export function getSections(command, isOwner) {
    const visible = CATEGORIES.filter(c => {
        if (c[2] === 'owner' || c[2] === 'settings') return isOwner;
        return true;
    });

    const rows = visible.map(c => ({
        title: `${c[3]} ${c[1]}`,
        description: `اضغط لعرض أوامر قسم ${c[1]}`,
        id: `.${command} ${c[0]}`
    }));

    if (isOwner) {
        rows.push({
            title: '👨🏻‍💻 قائمة المطورين السريعة',
            description: 'أوامر تحكم سريعة للمطورين',
            id: `.${command} dev`
        });
    }
    return rows;
}

// ===== القائمة الرئيسية =====
export function buildMainMenuMessage(m, bot, command, totalUsers, isOwner) {
    const now = new Date();
    const week = now.toLocaleDateString('ar-EG', { weekday: 'long' });
    const date = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
    const nameBot = getBotName(bot);
    const user = getUserInfo(m.sender, isOwner);
    const rows = getSections(command, isOwner);

    const bodyText = `╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊@${m.sender.split('@')[0]}⌉
── • ◈ • ──
*⌝🤖┊${nameBot}┊🤖⌞*
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹${nameBot}›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
> │┊ ۬.͜ـ🌙˖ ⟨الاسم: ${m.pushName || 'مجهول'}☇
> │┊ ۬.͜ـ👑˖ ⟨المطور: 𝐄𝐒𝐂𝐀𝐍𝛩𝐑☇
> │┊ ۬.͜ـ📅˖ ⟨اليوم: ${week}☇
> │┊ ۬.͜ـ🗓˖ ⟨التاريخ: ${date}☇
> │┊ ۬.͜ـ🍒˖ ⟨مستواك: ${user.level}☇
> │┊ ۬.͜ـ📯˖ ⟨رتبتك: ${user.role}☇
> │┊ ۬.͜ـ📡˖ ⟨المستخدمين: ${totalUsers}☇
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ─๋︩︪─═⊐‹${nameBot}›⊏═┈ ─๋︩︪─⊰ـ`;

    return {
        media: { url: getImg(bot) },
        mediaType: 'image',
        caption: bodyText,
        buttons: [
            {
                name: 'single_select',
                params: {
                    title: '⌈🍭┊اوامر┊🍬⌋',
                    sections: [{ title: '❪🐣┊مـهـام_الـبـوت┊🍡❫', rows }]
                }
            },
            { name: 'cta_url', params: { display_text: '⌈📩╎شات البوت╎📩⌋', url: OWNER_LINK } },
            { name: 'quick_reply', params: { display_text: '⌈🌟╎تقييم╎🌟⌋', id: '.تقيم' } },
            { name: 'cta_url', params: { display_text: '⌈📲╎قـنـاة الـمـطـور╎📲⌋', url: CHANNEL_LINK } },
            { name: 'quick_reply', params: { display_text: '⌈🚀╎المطور╎🚀⌋', id: '.المطور' } }
        ],
        mentions: [m.sender],
        newsletter: NEWSLETTER
    };
}

// ===== قائمة قسم =====
export function buildSectionMenu(bot, command, cat, usageList) {
    const nameBot = getBotName(bot);
    const emoji = cat[3];
    const title = cat[1];

    const rows = usageList.map(u => ({
        title: `${emoji} ${u}`,
        description: 'اضغط لتشغيل الأمر',
        id: `.${u}`
    }));

    const cmdsText = usageList.map(u => `> │┊ ۬.͜ـ${emoji}˖ ⟨${u}☇`).join('\n');

    const bodyText = `╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊@⁨𝑬𝑠ᥴ𝑎ꪀ𝑜𝑟⁩⌉
── • ◈ • ──
*⌝${emoji}┊قـائـمـة ${title}┊${emoji}⌞*
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹${nameBot}›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
${cmdsText}
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊐‹${nameBot}›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ`;

    return {
        media: { url: getImg(bot) },
        mediaType: 'image',
        caption: bodyText,
        buttons: [
            {
                name: 'single_select',
                params: {
                    title: `⌈${emoji}┊الأوامر┊${emoji}⌋`,
                    sections: [{ title: `❪${emoji}┊${title}┊${emoji}❫`, rows }]
                }
            },
            { name: 'quick_reply', params: { display_text: '⌈🔙╎الرئيسية╎🔙⌋', id: `.${command}` } }
        ],
        mentions: [],
        newsletter: NEWSLETTER
    };
}

// ===== قائمة المطورين السريعة =====
export function buildDevMenu(bot, command) {
    const nameBot = getBotName(bot);
    const cmds = [
        { cmd: 'بنج',          desc: 'اختبار سرعة البوت' },
        { cmd: 'الرام',        desc: 'إظهار استخدام الذاكرة' },
        { cmd: 'الايرورات',    desc: 'عرض آخر الأخطاء' },
        { cmd: 'اضافه_ملف',    desc: 'إضافة ملف أمر جديد' },
        { cmd: 'اضافه_قسم',    desc: 'إضافة قسم جديد' },
        { cmd: 'ضيف_مطور',     desc: 'إضافة مطور جديد' },
        { cmd: 'حظر',          desc: 'حظر مستخدم من البوت' },
        { cmd: 'فك_حظر',       desc: 'فك حظر مستخدم' },
        { cmd: 'حظر_عام',      desc: 'حظر عضو من كل الجروبات' },
        { cmd: 'كتم_عام',      desc: 'كتم عضو في كل الجروبات' },
        { cmd: 'احصائيات_عامه',desc: 'إحصائيات الحماية لكل البوت' },
        { cmd: 'البوتات',      desc: 'إدارة البوتات الفرعية' },
        { cmd: 'اذاعة_فرعي',   desc: 'إذاعة لكل البوتات الفرعية' },
        { cmd: 'تنظيف',        desc: 'حذف الملفات المؤقتة' },
        { cmd: 'تنظيف_شامل',   desc: 'تنظيف شامل للسيرفر' },
        { cmd: 'لمطور',        desc: 'معرفة الـ JID بتاعك' }
    ];

    const cmdsText = cmds.map(c => `> │┊ ۬.͜ـ👨🏻‍💻˖ ⟨${c.cmd} | ${c.desc}☇`).join('\n');

    const bodyText = `╮••─๋︩︪──๋︩︪─═⊐‹﷽›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ مرحــبـا ⌊@⁨𝑬𝑠ᥴ𝑎ꪀ𝑜𝑟⁩⌉
── • ◈ • ──
*⌝👨🏻‍💻┊قـائـمـة المطورين┊👨🏻‍💻⌞*
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹${nameBot}›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
${cmdsText}
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ ─๋︩︪─┈ ─๋︩︪─═⊐‹${nameBot}›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ`;

    return {
        media: { url: getImg(bot) },
        mediaType: 'image',
        caption: bodyText,
        buttons: [
            {
                name: 'single_select',
                params: {
                    title: '⌈👨🏻‍💻┊أوامر المطورين┊👨🏻‍💻⌋',
                    sections: [{
                        title: '❪👨🏻‍💻┊قسم المطورين┊👨🏻‍💻❫',
                        rows: cmds.map(c => ({
                            title: `👨🏻‍💻 ${c.cmd}`,
                            description: c.desc,
                            id: `.${c.cmd}`
                        }))
                    }]
                }
            },
            { name: 'quick_reply', params: { display_text: '⌈🔙╎الرئيسية╎🔙⌋', id: `.${command}` } }
        ],
        mentions: [],
        newsletter: NEWSLETTER
    };
}
