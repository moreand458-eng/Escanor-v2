// ════════════════════════════════════════
//  army.js - الجنود والتجنيد
//  ESCANOR CLASH System
// ════════════════════════════════════════

import {
    getPlayer, isRegistered,
    ARMY_DATA, ARMY_ALIASES, BUILDINGS_DATA,
    calcPower
} from './db.js';

// صور الجنود لكل نوع - استبدلها بصورك
const ARMY_IMGS = {
    infantry: 'https://i.postimg.cc/L8Kd2Y5x/soldier-lv1.jpg',
    archer:   'https://i.postimg.cc/Y0WQ4RKH/soldier-lv2.jpg',
    knight:   'https://i.postimg.cc/7LMnfPVP/soldier-lv3.jpg',
    mage:     'https://i.postimg.cc/9FTBrHGJ/soldier-lv4.jpg',
    giant:    'https://i.postimg.cc/9FTBrHGJ/soldier-lv5.jpg',
};

const MAX_ARMY = 200; // أقصى عدد جنود

const totalArmy = (p) => Object.values(p.army).reduce((a, b) => a + b, 0);

const handler = async (m, { conn, command, args, text }) => {
    const jid = m.sender;
    if (!isRegistered(jid)) return m.reply('*❌ سجل الأول:* *.تسجيل*');
    const p = getPlayer(jid);

    switch (command) {

        // ─ عرض الجيش ─
        case 'جيشي': case 'army': case 'جنودي': {
            const total = totalArmy(p);
            const power = calcPower(p);
            const lines = Object.entries(p.army).map(([type, count]) => {
                const d = ARMY_DATA[type];
                return `${d.emoji} *${d.name}:* ${count}`;
            });
            return m.reply(
                `╭──────────────────╮\n` +
                `┃ ⚔️ *جيشك*\n` +
                `╰──────────────────╯\n\n` +
                lines.join('\n') + '\n\n' +
                `👥 *الإجمالي:* ${total}/${MAX_ARMY}\n` +
                `💪 *القوة الكلية:* ${power}\n\n` +
                `*.جند <نوع> <عدد>* للتجنيد`
            );
        }

        // ─ تجنيد جنود ─
        case 'جند': case 'train': case 'تجنيد': {
            const parts  = (text || '').trim().split(/\s+/);
            const typeAr = parts[0]?.toLowerCase();
            const count  = parseInt(parts[1]) || 1;

            if (!typeAr) {
                // عرض الأنواع المتاحة
                const barracksLvl = p.buildings.barracks;
                const available   = BUILDINGS_DATA.barracks.unlocks[barracksLvl] || [];
                const lines = Object.entries(ARMY_DATA).map(([key, d]) => {
                    const locked = !available.includes(key);
                    const costTxt = [];
                    if (d.cost.elixir) costTxt.push(`⚡${d.cost.elixir}`);
                    if (d.cost.gold)   costTxt.push(`🪙${d.cost.gold}`);
                    if (d.cost.gems)   costTxt.push(`💎${d.cost.gems}`);
                    return `${locked ? '🔒' : d.emoji} *${d.name}* - ${costTxt.join('+')} ${locked ? `(ثكنة مستوى ${d.requiresBarracks})` : ''}`;
                });
                return m.reply(
                    `*⚔️ الجنود المتاحة:*\n\n` +
                    lines.join('\n') + '\n\n' +
                    `*.جند <نوع> <عدد>*\n` +
                    `مثال: \`.جند مشاة 10\``
                );
            }

            const type = ARMY_ALIASES[typeAr] || typeAr;
            const data = ARMY_DATA[type];
            if (!data) return m.reply(`*❌ نوع مش موجود:* ${typeAr}\n\n*.جند* لعرض الأنواع`);

            // تحقق من الثكنة
            const barracksLvl = p.buildings.barracks;
            const available   = BUILDINGS_DATA.barracks.unlocks[barracksLvl] || [];
            if (!available.includes(type)) {
                return m.reply(
                    `*🔒 ${data.name} مقفول*\n\n` +
                    `محتاج ثكنة مستوى *${data.requiresBarracks}*\n` +
                    `عندك: مستوى ${barracksLvl}`
                );
            }

            // تحقق من الطاقة
            const cur   = totalArmy(p);
            const space = MAX_ARMY - cur;
            if (space <= 0) return m.reply(`*❌ الجيش ممتلئ!*\n\nحذف جنود أول: *.فك_جند <نوع> <عدد>*`);
            const actualCount = Math.min(count, space);

            // تحقق من التكلفة
            const totalGold   = (data.cost.gold   || 0) * actualCount;
            const totalElixir = (data.cost.elixir || 0) * actualCount;
            const totalGems   = (data.cost.gems   || 0) * actualCount;

            if (p.gold   < totalGold)   return m.reply(`*❌ محتاج ${totalGold} ذهب - عندك ${p.gold}*`);
            if (p.elixir < totalElixir) return m.reply(`*❌ محتاج ${totalElixir} إكسير - عندك ${p.elixir}*`);
            if (p.gems   < totalGems)   return m.reply(`*❌ محتاج ${totalGems} جواهر - عندك ${p.gems}*`);

            // خصم وتجنيد
            p.gold   -= totalGold;
            p.elixir -= totalElixir;
            p.gems   -= totalGems;
            p.army[type] = (p.army[type] || 0) + actualCount;

            const img = ARMY_IMGS[type];
            await conn.sendMessage(m.chat, {
                image: { url: img },
                caption:
                    `*✅ تم التجنيد!*\n\n` +
                    `${data.emoji} *${actualCount} ${data.name}*\n\n` +
                    `👥 الجيش: ${totalArmy(p)}/${MAX_ARMY}\n` +
                    `💪 القوة: ${calcPower(p)}\n\n` +
                    `🪙 ${p.gold} ┃ ⚡ ${p.elixir} ┃ 💎 ${p.gems}`
            }, { quoted: m });
            break;
        }

        // ─ تسريح جنود ─
        case 'فك_جند': case 'dismiss': {
            const parts  = (text || '').trim().split(/\s+/);
            const typeAr = parts[0]?.toLowerCase();
            const count  = parseInt(parts[1]) || 1;
            if (!typeAr) return m.reply('*📌 مثال:* `.فك_جند مشاة 5`');
            const type = ARMY_ALIASES[typeAr] || typeAr;
            if (!ARMY_DATA[type]) return m.reply(`*❌ نوع مش موجود*`);
            const actual = Math.min(count, p.army[type] || 0);
            if (!actual) return m.reply(`*❌ ما عندكش ${ARMY_DATA[type].name}`);
            p.army[type] -= actual;
            return m.reply(
                `*✅ تم التسريح*\n\n` +
                `${ARMY_DATA[type].emoji} ${actual} ${ARMY_DATA[type].name}\n` +
                `👥 الجيش: ${totalArmy(p)}/${MAX_ARMY}`
            );
        }
    }
};

handler.usage    = ['جيشي', 'جند', 'فك_جند'];
handler.category = 'dev';
handler.command  = ['جيشي','army','جنودي','جند','train','تجنيد','فك_جند','dismiss'];

export default handler;
