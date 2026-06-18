// ════════════════════════════════════════
//  menu.js - قائمة اللعبة والتسجيل
//  ESCANOR CLASH System
// ════════════════════════════════════════

import {
    getDB, getPlayer, createPlayer, isRegistered,
    calcPower, calcProtected, BUILDINGS_DATA, ARMY_DATA
} from './db.js';

// صورة القلعة الرئيسية حسب المستوى
const CASTLE_IMGS = [
    'https://i.postimg.cc/L8Kd2Y5x/castle-lv1.jpg',
    'https://i.postimg.cc/Y0WQ4RKH/castle-lv2.jpg',
    'https://i.postimg.cc/7LMnfPVP/castle-lv3.jpg',
    'https://i.postimg.cc/9FTBrHGJ/castle-lv4.jpg',
    'https://i.postimg.cc/9FTBrHGJ/castle-lv5.jpg',
];

const handler = async (m, { conn, command, bot }) => {
    const jid  = m.sender;
    const name = m.pushName || jid.split('@')[0];

    switch (command) {

        // ─ تسجيل ─
        case 'تسجيل': case 'register': {
            if (isRegistered(jid)) {
                const p = getPlayer(jid);
                return m.reply(
                    `*✅ أنت مسجل بالفعل!*\n\n` +
                    `🪙 ${p.gold} ┃ ⚡ ${p.elixir} ┃ 💎 ${p.gems}\n\n` +
                    `*.قلعتي* لعرض قلعتك`
                );
            }
            createPlayer(jid, name);
            return conn.sendMessage(m.chat, {
                image: { url: CASTLE_IMGS[0] },
                caption:
                    `*🎉 مرحباً ${name} في ESCANOR CLASH!*\n\n` +
                    `🏰 قلعتك جاهزة - المستوى 1\n\n` +
                    `💰 *رصيدك الابتدائي:*\n` +
                    `🪙 100 ذهب ┃ ⚡ 50 إكسير ┃ 💎 5 جواهر\n\n` +
                    `━━━━━━━━━━━━━━━\n` +
                    `📌 *ابدأ من هنا:*\n` +
                    `*.قلعتي* ← شوف قلعتك\n` +
                    `*.مبانيه* ← المباني\n` +
                    `*.جند مشاة 5* ← جند جنود\n` +
                    `*.daily* ← المكافأة اليومية\n` +
                    `*.كلاش* ← كل الأوامر`
            }, { quoted: m });
        }

        // ─ عرض القلعة ─
        case 'قلعتي': case 'mycastle': case 'base': {
            if (!isRegistered(jid)) return m.reply('*❌ سجل الأول:* *.تسجيل*');
            const p    = getPlayer(jid);
            const lvl  = p.buildings.castle;
            const img  = CASTLE_IMGS[Math.min(lvl - 1, 4)];
            const pow  = calcPower(p);
            const prot = calcProtected(p);
            const army = Object.values(p.army).reduce((a, b) => a + b, 0);

            // شريط القوة
            const bar = (val, max, len = 10) => {
                const filled = Math.round((val / max) * len);
                return '█'.repeat(filled) + '░'.repeat(len - filled);
            };

            await conn.sendMessage(m.chat, {
                image: { url: img },
                caption:
                    `╭────────────────────╮\n` +
                    `┃ 🏰 *قلعة ${name}*\n` +
                    `╰────────────────────╯\n\n` +
                    `🏰 *القلعة:* مستوى ${lvl}/5\n` +
                    `💪 *القوة:* ${pow}\n` +
                    `🛡️ *الحماية:* ${prot}%\n` +
                    `👥 *الجيش:* ${army} جندي\n\n` +
                    `💰 *الخزينة:*\n` +
                    `🪙 ${p.gold.toLocaleString()} ذهب\n` +
                    `⚡ ${p.elixir.toLocaleString()} إكسير\n` +
                    `💎 ${p.gems.toLocaleString()} جواهر\n\n` +
                    `⚔️ *الحروب:* ${p.stats.wins || 0}✅ ${p.stats.losses || 0}❌\n\n` +
                    `${p.shield && Date.now() < p.shield
                        ? `🛡️ درع نشط (${Math.ceil((p.shield - Date.now()) / 3600000)}ساعة)\n\n`
                        : ''
                    }` +
                    `━━━━━━━━━━━━━━━\n` +
                    `*.مبانيه* ┃ *.جيشي* ┃ *.عملاتي*`
            }, { quoted: m });
            break;
        }

        // ─ قائمة كل الأوامر ─
        case 'كلاش': case 'clash': case 'لعبة': {
            try {
                return conn.sendButton(m.chat, {
                    imageUrl: CASTLE_IMGS[isRegistered(jid) ? Math.min(getPlayer(jid).buildings.castle - 1, 4) : 0],
                    bodyText:
                        `*⚔️ ESCANOR CLASH*\n\n` +
                        `مرحباً ${name}!\n` +
                        `${isRegistered(jid) ? `🪙 ${getPlayer(jid).gold} ┃ ⚡ ${getPlayer(jid).elixir} ┃ 💎 ${getPlayer(jid).gems}` : 'سجل الأول للبداية'}`,
                    footerText: 'ESCANOR CLASH System',
                    buttons: [
                        {
                            name: 'single_select',
                            params: {
                                title: '📋 اختار القسم',
                                sections: [
                                    {
                                        title: '🏰 القلعة والمباني',
                                        rows: [
                                            { title: '🏰 قلعتي',      description: 'عرض قلعتك الكاملة',      id: '.قلعتي' },
                                            { title: '🏗️ مبانيه',    description: 'عرض كل مبانيك',          id: '.مبانيه' },
                                            { title: '⬆️ ترقية',      description: 'رقي مبنى معين',          id: '.طور' },
                                            { title: '⛏️ اجمع',      description: 'اجمع من المناجم',        id: '.اجمع' },
                                        ]
                                    },
                                    {
                                        title: '⚔️ الجيش والحرب',
                                        rows: [
                                            { title: '👥 جيشي',       description: 'عرض جيشك',              id: '.جيشي' },
                                            { title: '🪖 تجنيد',      description: 'جند جنود جدد',          id: '.جند' },
                                            { title: '⚔️ هجوم',       description: 'هاجم لاعب تاني',       id: '.هاجم' },
                                            { title: '⚔️ حروبي',      description: 'إحصائيات حروبك',        id: '.حروبي' },
                                            { title: '🛡️ درع',        description: 'اشتري درع حماية',       id: '.درع 8' },
                                        ]
                                    },
                                    {
                                        title: '💰 الاقتصاد',
                                        rows: [
                                            { title: '💰 رصيدي',      description: 'عملاتك الحالية',        id: '.عملاتي' },
                                            { title: '🎁 daily',      description: 'المكافأة اليومية',      id: '.daily' },
                                            { title: '🔄 صرف',        description: 'حول جواهر لذهب',       id: '.صرف' },
                                        ]
                                    },
                                    {
                                        title: '📋 المهام',
                                        rows: [
                                            { title: '📋 مهام اليوم',  description: 'المهام اليومية',        id: '.مهام' },
                                            { title: '📅 مهام الأسبوع', description: 'المهام الأسبوعية',    id: '.مهام_اسبوعية' },
                                            { title: '🎁 استلم',       description: 'استلم مكافآت المهام',  id: '.استلم_مهام' },
                                        ]
                                    },
                                    {
                                        title: '🏆 الترتيب',
                                        rows: [
                                            { title: '🏆 ترتيب',      description: 'أقوى اللاعبين',         id: '.ترتيب' },
                                        ]
                                    },
                                ]
                            }
                        }
                    ],
                    newsletter: { name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐋 🕷️', jid: '120363422581600030@newsletter' },
                    interactiveConfig: { buttons_limits: 1 }
                }, m);
            } catch {
                return m.reply(
                    `*⚔️ ESCANOR CLASH - الأوامر*\n\n` +
                    `*🏰 القلعة:*\n` +
                    `*.تسجيل* ┃ *.قلعتي* ┃ *.مبانيه*\n` +
                    `*.طور <مبنى>* ┃ *.بنى <مبنى>*\n` +
                    `*.اجمع* ┃ *.daily*\n\n` +
                    `*⚔️ الجيش:*\n` +
                    `*.جيشي* ┃ *.جند <نوع> <عدد>*\n` +
                    `*.هاجم @شخص* ┃ *.حروبي*\n` +
                    `*.درع <ساعات>*\n\n` +
                    `*💰 الاقتصاد:*\n` +
                    `*.عملاتي* ┃ *.صرف <جواهر>*\n\n` +
                    `*📋 المهام:*\n` +
                    `*.مهام* ┃ *.مهام_اسبوعية* ┃ *.استلم_مهام*\n\n` +
                    `*🏆 الترتيب:*\n` +
                    `*.ترتيب*`
                );
            }
        }
    }
};

handler.usage    = ['تسجيل', 'قلعتي', 'كلاش'];
handler.category = 'dev';
handler.command  = ['تسجيل','register','قلعتي','mycastle','base','كلاش','clash','لعبة'];

export default handler;
