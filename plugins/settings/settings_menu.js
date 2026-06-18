// ════════════════════════════════════════
//  قسم الإعدادات - للمطورين فقط 👑
// ════════════════════════════════════════

const handler = async (m, { conn, bot, command, args }) => {
    if (!m.isOwner) return m.reply('*❌ قسم الإعدادات للمطورين فقط*');

    const sub = args[0]?.toLowerCase()?.trim();

    // ══ القائمة الرئيسية ══
    if (!sub) {
        try {
            return conn.sendButton(m.chat, {
                imageUrl: 'https://i.postimg.cc/xd6xmf0p/9e0c32d018f9bea5a756fffa76e95b3a.jpg',
                bodyText:
                    `*⚙️ لوحة الإعدادات*\n\n` +
                    `مرحباً ${m.pushName || 'مطور'} 👑\n` +
                    `اختار من القائمة أو اكتب الأمر مباشرة`,
                footerText: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹 BOT | إعدادات المطورين',
                buttons: [
                    {
                        name: 'single_select',
                        params: {
                            title: '⚙️ اختار الإعداد',
                            sections: [
                                {
                                    title: '🔧 الأوامر والأقسام',
                                    rows: [
                                        { title: '🚫 إيقاف أمر',   description: 'توقف أمر معين', id: `.اعدادات ايقاف_امر` },
                                        { title: '✅ تشغيل أمر',   description: 'تشغيل أمر موقف', id: `.اعدادات تشغيل_امر` },
                                        { title: '🚫 إيقاف قسم',   description: 'توقف قسم كامل', id: `.اعدادات ايقاف_قسم` },
                                        { title: '✅ تشغيل قسم',   description: 'تشغيل قسم موقف', id: `.اعدادات تشغيل_قسم` },
                                        { title: '📋 عرض الموقف',  description: 'شوف الأوامر الموقفة', id: `.الموقف` },
                                    ]
                                },
                                {
                                    title: '📢 القناة',
                                    rows: [
                                        { title: '❤️ تفاعل القناة on',  description: 'تفعيل التفاعل التلقائي مع القناة', id: `.تفاعل_القناة on` },
                                        { title: '❌ تفاعل القناة off', description: 'إيقاف التفاعل مع القناة', id: `.تفاعل_القناة off` },
                                        { title: '📲 انضم للقناة',      description: 'أمر الانضمام للقناة', id: `.انضم_القناة` },
                                    ]
                                },
                                {
                                    title: '🤖 البوتات',
                                    rows: [
                                        { title: '🚫 ضد البوتات on',  description: 'طرد فوري للبوتات', id: `.ضد_البوتات on` },
                                        { title: '⚠️ ضد البوتات off', description: 'إنذار 3 مرات ثم طرد', id: `.ضد_البوتات off` },
                                        { title: '🔍 كشف البوتات',     description: 'يكشف البوتات في الجروب', id: `.كشف_البوتات` },
                                    ]
                                },
                                {
                                    title: '⚙️ إعدادات عامة',
                                    rows: [
                                        { title: '🔤 تغيير البريفكس', description: 'تغيير الرمز اللي بيبدأ بيه الأمر', id: `.بريفكس` },
                                        { title: '📊 عرض الأقسام',    description: 'كل الأقسام المتاحة', id: `.الاقسام` },
                                    ]
                                },
                            ]
                        }
                    }
                ],
                mentions: [m.sender],
                newsletter: { name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐋 🕷️', jid: '120363422581600030@newsletter' },
                interactiveConfig: { buttons_limits: 1 }
            }, m);
        } catch {
            return m.reply(
                `*⚙️ لوحة الإعدادات*\n\n` +
                `*🔧 الأوامر والأقسام:*\n` +
                `• *.ايقاف_امر <اسم>*\n• *.تشغيل_امر <اسم>*\n• *.ايقاف_قسم <اسم>*\n• *.تشغيل_قسم <اسم>*\n• *.الموقف*\n\n` +
                `*📢 القناة:*\n` +
                `• *.تفاعل_القناة on/off*\n• *.انضم_القناة*\n\n` +
                `*🤖 البوتات:*\n` +
                `• *.ضد_البوتات on/off*\n• *.كشف_البوتات*\n\n` +
                `*⚙️ عام:*\n` +
                `• *.بريفكس <رمز>*\n• *.الاقسام*`
            );
        }
    }

    // ══ Sub-commands shortcuts ══
    const remaining = args.slice(1).join(' ');

    const SHORTCUTS = {
        'ايقاف_امر':   'ايقاف_امر',
        'تشغيل_امر':   'تشغيل_امر',
        'ايقاف_قسم':   'ايقاف_قسم',
        'تشغيل_قسم':   'تشغيل_قسم',
    };

    if (SHORTCUTS[sub]) {
        if (!remaining) return m.reply(`*📌 مثال:* \`.اعدادات ${sub} اسم_الأمر\``);
        return m.reply(`*📌 استخدم مباشرة:* \`.${SHORTCUTS[sub]} ${remaining}\``);
    }

    return m.reply(`*❌ أمر غير معروف:* ${sub}\n\n*.اعدادات* لعرض القائمة`);
};

handler.usage    = ['اعدادات'];
handler.category = 'settings';
handler.command  = ['اعدادات', 'settings', 'الاعدادات'];
handler.owner    = true;

export default handler;
