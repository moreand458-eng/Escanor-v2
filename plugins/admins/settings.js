// helper - يجيب إعدادات الجروب من store آمن
const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

async function handler(m, { conn, command, args }) {
    const chatId = m.chat;
    const subCmd = args[0]?.toLowerCase()?.trim();

    if (!subCmd) {
        return conn.sendButton(m.chat, {
            imageUrl: 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg',
            bodyText: '*⚙️ نظام التفعيل والتشغيل*\n\nاختار من القائمة أو اكتب الأمر مباشرة',
            footerText: '𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT',
            buttons: [
                {
                    name: 'single_select',
                    params: {
                        title: '📋 اختار الإعداد',
                        sections: [
                            {
                                title: '🎉 الترحيب',
                                rows: [
                                    { title: '✅ تشغيل الترحيب', id: '.تفعيل تشغيل_الترحيب' },
                                    { title: '❌ ايقاف الترحيب', id: '.تفعيل ايقاف_الترحيب' },
                                ]
                            },
                            {
                                title: '🛡️ الحماية',
                                rows: [
                                    { title: '✅ تشغيل مضاد الروابط', id: '.تفعيل تشغيل_مضاد_الروابط' },
                                    { title: '❌ ايقاف مضاد الروابط', id: '.تفعيل ايقاف_مضاد_الروابط' },
                                    { title: '✅ تشغيل ضد الشاتم', id: '.تفعيل تشغيل_ضد_الشاتم' },
                                    { title: '❌ ايقاف ضد الشاتم', id: '.تفعيل ايقاف_ضد_الشاتم' },
                                    { title: '✅ تشغيل مضاد البوتات', id: '.تفعيل تشغيل_مضاد_البوتات' },
                                    { title: '❌ ايقاف مضاد البوتات', id: '.تفعيل ايقاف_مضاد_البوتات' },
                                ]
                            },
                            {
                                title: '🚫 مضادات الميديا',
                                rows: [
                                    { title: '✅ تشغيل مضاد الستيكر', id: '.تفعيل تشغيل_مضاد_الستيكر' },
                                    { title: '❌ ايقاف مضاد الستيكر', id: '.تفعيل ايقاف_مضاد_الستيكر' },
                                    { title: '✅ تشغيل مضاد الفيديو', id: '.تفعيل تشغيل_مضاد_الفيديو' },
                                    { title: '❌ ايقاف مضاد الفيديو', id: '.تفعيل ايقاف_مضاد_الفيديو' },
                                    { title: '✅ تشغيل مضاد الصور', id: '.تفعيل تشغيل_مضاد_الصور' },
                                    { title: '❌ ايقاف مضاد الصور', id: '.تفعيل ايقاف_مضاد_الصور' },
                                    { title: '✅ تشغيل مضاد الصوت', id: '.تفعيل تشغيل_مضاد_الصوت' },
                                    { title: '❌ ايقاف مضاد الصوت', id: '.تفعيل ايقاف_مضاد_الصوت' },
                                ]
                            },
                            {
                                title: '👑 الصلاحيات',
                                rows: [
                                    { title: '✅ تشغيل الادمن فقط', id: '.تفعيل تشغيل_الادمن' },
                                    { title: '❌ ايقاف الادمن فقط', id: '.تفعيل ايقاف_الادمن' },
                                    { title: '🔒 مطور فقط', id: '.تفعيل مطور_فقط' },
                                    { title: '🔓 مطور عام', id: '.تفعيل مطور_عام' },
                                    { title: '🔒 ايقاف الخاص', id: '.تفعيل ايقاف_خاص' },
                                    { title: '🔓 تشغيل الخاص', id: '.تفعيل تشغيل_خاص' },
                                ]
                            },
                            {
                                title: '⚙️ البوتات الفرعية',
                                rows: [
                                    { title: '❌ ايقاف الفرعي', id: '.تفعيل ايقاف_الفرعي' },
                                    { title: '✅ تشغيل الفرعي', id: '.تفعيل تشغيل_الفرعي' },
                                ]
                            }
                        ]
                    }
                }
            ],
            mentions: [m.sender],
            newsletter: { name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐿 🕷️', jid: '120363422581600030@newsletter' },
            interactiveConfig: { buttons_limits: 1, list_title: 'القائمة', button_title: 'اختار من هنا', canonical_url: 'https://whatsapp.com' }
        }, m);
    }

    const checkPerm = (adminOnly = true) => {
        if (adminOnly && !m.isOwner && !m.isAdmin) return '*「🔥」 الامـࢪ دا بـتـا؏ الادمــن بــس يــسـطــا*';
        if (!adminOnly && !m.isOwner) return '*「🔥」الامـࢪ دا بـتـا؏ إسـكانـور  مـطـوࢪي.*';
        return null;
    };

    // استخدم global._gs بدل global.db.groups عشان يتجنب مشكلة الـ Proxy
    const g = getG(chatId);

    const setG = (key, val, onMsg, offMsg, adminOnly = true) => {
        const err = checkPerm(adminOnly);
        if (err) return err;
        if (val) {
            g[key] = true;
        } else {
            delete g[key];
        }
        return val ? onMsg : offMsg;
    };

    const CASES = {
        'تشغيل_الترحيب':       () => setG('welcomeDisabled', false,  '*✅ تم تشغيل الترحيب* 🎉', ''),
        'ايقاف_الترحيب':       () => setG('welcomeDisabled', true, '', '*✅ تم ايقاف الترحيب*'),
        'تشغيل_مضاد_الروابط': () => setG('antiLink', true,  '*✅ تم تشغيل مضاد الروابط* 🔗', ''),
        'ايقاف_مضاد_الروابط': () => setG('antiLink', false, '', '*✅ تم ايقاف مضاد الروابط*'),
        'تشغيل_ضد_الشاتم':    () => setG('antiCurse', true,  '*✅ تم تشغيل ضد الشاتم* 🚫', ''),
        'ايقاف_ضد_الشاتم':    () => setG('antiCurse', false, '', '*✅ تم ايقاف ضد الشاتم*'),
        'تشغيل_مضاد_البوتات': () => setG('antiBots', true,  '*✅ تم تشغيل مضاد البوتات* 🤖', ''),
        'ايقاف_مضاد_البوتات': () => setG('antiBots', false, '', '*✅ تم ايقاف مضاد البوتات*'),
        'تشغيل_مضاد_الستيكر': () => setG('antiSticker', true,  '*✅ تم تشغيل مضاد الستيكر* 🎭', ''),
        'ايقاف_مضاد_الستيكر': () => setG('antiSticker', false, '', '*✅ تم ايقاف مضاد الستيكر*'),
        'تشغيل_مضاد_الفيديو': () => setG('antiVideo', true,  '*✅ تم تشغيل مضاد الفيديو* 🎬', ''),
        'ايقاف_مضاد_الفيديو': () => setG('antiVideo', false, '', '*✅ تم ايقاف مضاد الفيديو*'),
        'تشغيل_مضاد_الصور':   () => setG('antiImage', true,  '*✅ تم تشغيل مضاد الصور* 🖼️', ''),
        'ايقاف_مضاد_الصور':   () => setG('antiImage', false, '', '*✅ تم ايقاف مضاد الصور*'),
        'تشغيل_مضاد_الصوت':   () => setG('antiAudio', true,  '*✅ تم تشغيل مضاد الصوت* 🔉', ''),
        'ايقاف_مضاد_الصوت':   () => setG('antiAudio', false, '', '*✅ تم ايقاف مضاد الصوت*'),
        'تشغيل_الادمن': () => setG('adminOnly', true,  '*✅ تم تفعيل وضع الادمن* 👑', ''),
        'ايقاف_الادمن': () => setG('adminOnly', false, '', '*✅ تم فك وضع الادمن*'),
        'مطور_فقط': () => { const e = checkPerm(false); if (e) return e; global.ownerOnly = true; return '*✅ تم تفعيل وضع المطور فقط*'; },
        'مطور_عام':  () => { const e = checkPerm(false); if (e) return e; global.ownerOnly = false; return '*✅ تم تفعيل وضع المطور العام*'; },
        'ايقاف_خاص': () => { const e = checkPerm(false); if (e) return e; global.devMode = true; return '*✅ تم ايقاف البوت في الخاص للعامة*'; },
        'تشغيل_خاص': () => { const e = checkPerm(false); if (e) return e; global.devMode = false; return '*✅ تم تشغيل البوت في الخاص للكل*'; },
        'ايقاف_الفرعي': () => { const e = checkPerm(false); if (e) return e; global.noSub = true; return '*✅ تم ايقاف البوتات الفرعية*'; },
        'تشغيل_الفرعي': () => { const e = checkPerm(false); if (e) return e; global.noSub = false; return '*✅ تم تشغيل البوتات الفرعية*'; },
    };

    const fn = CASES[subCmd];
    if (!fn) return m.reply('*❌ أمر غير معروف، اكتب .تفعيل للقائمة*');
    const result = fn();
    if (result) await m.reply(result);
}

handler.usage = ['تفعيل'];
handler.category = 'admins';
handler.command = ['تفعيل'];
export default handler;
