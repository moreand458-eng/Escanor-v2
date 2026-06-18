// ════════════════════════════════════════
//  buildings.js - المباني والترقيات
//  ESCANOR CLASH System
// ════════════════════════════════════════

import {
    getPlayer, isRegistered,
    BUILDINGS_DATA, BUILDING_ALIASES,
    getBuildingName, getBuildingEmoji,
    canUpgrade, deductCost, MAX_LEVEL
} from './db.js';

// صور المباني لكل مستوى - استبدلها بصورك
const BUILDING_IMGS = {
    castle:    [
        'https://i.postimg.cc/L8Kd2Y5x/castle-lv1.jpg',
        'https://i.postimg.cc/Y0WQ4RKH/castle-lv2.jpg',
        'https://i.postimg.cc/7LMnfPVP/castle-lv3.jpg',
        'https://i.postimg.cc/9FTBrHGJ/castle-lv4.jpg',
        'https://i.postimg.cc/9FTBrHGJ/castle-lv5.jpg',
    ],
    goldMine:  ['https://i.postimg.cc/L8Kd2Y5x/mine-lv1.jpg','https://i.postimg.cc/Y0WQ4RKH/mine-lv2.jpg','https://i.postimg.cc/7LMnfPVP/mine-lv3.jpg','https://i.postimg.cc/9FTBrHGJ/mine-lv4.jpg','https://i.postimg.cc/9FTBrHGJ/mine-lv5.jpg'],
    elixirLab: ['https://i.postimg.cc/L8Kd2Y5x/elix-lv1.jpg','https://i.postimg.cc/Y0WQ4RKH/elix-lv2.jpg','https://i.postimg.cc/7LMnfPVP/elix-lv3.jpg','https://i.postimg.cc/9FTBrHGJ/elix-lv4.jpg','https://i.postimg.cc/9FTBrHGJ/elix-lv5.jpg'],
    gemMine:   ['https://i.postimg.cc/L8Kd2Y5x/gem-lv1.jpg','https://i.postimg.cc/Y0WQ4RKH/gem-lv2.jpg','https://i.postimg.cc/7LMnfPVP/gem-lv3.jpg','https://i.postimg.cc/9FTBrHGJ/gem-lv4.jpg','https://i.postimg.cc/9FTBrHGJ/gem-lv5.jpg'],
    wall:      ['https://i.postimg.cc/L8Kd2Y5x/wall-lv1.jpg','https://i.postimg.cc/Y0WQ4RKH/wall-lv2.jpg','https://i.postimg.cc/7LMnfPVP/wall-lv3.jpg','https://i.postimg.cc/9FTBrHGJ/wall-lv4.jpg','https://i.postimg.cc/9FTBrHGJ/wall-lv5.jpg'],
    barracks:  ['https://i.postimg.cc/L8Kd2Y5x/bar-lv1.jpg','https://i.postimg.cc/Y0WQ4RKH/bar-lv2.jpg','https://i.postimg.cc/7LMnfPVP/bar-lv3.jpg','https://i.postimg.cc/9FTBrHGJ/bar-lv4.jpg','https://i.postimg.cc/9FTBrHGJ/bar-lv5.jpg'],
    hospital:  ['https://i.postimg.cc/L8Kd2Y5x/hosp-lv1.jpg','https://i.postimg.cc/Y0WQ4RKH/hosp-lv2.jpg','https://i.postimg.cc/7LMnfPVP/hosp-lv3.jpg','https://i.postimg.cc/9FTBrHGJ/hosp-lv4.jpg','https://i.postimg.cc/9FTBrHGJ/hosp-lv5.jpg'],
    lab:       ['https://i.postimg.cc/L8Kd2Y5x/lab-lv1.jpg','https://i.postimg.cc/Y0WQ4RKH/lab-lv2.jpg','https://i.postimg.cc/7LMnfPVP/lab-lv3.jpg','https://i.postimg.cc/9FTBrHGJ/lab-lv4.jpg','https://i.postimg.cc/9FTBrHGJ/lab-lv5.jpg'],
};

const getImg = (building, level) =>
    BUILDING_IMGS[building]?.[Math.min(level - 1, 4)] ||
    'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg';

// عرض تفاصيل مبنى واحد
const showBuilding = async (m, conn, p, key) => {
    const data   = BUILDINGS_DATA[key];
    const curLvl = p.buildings[key];
    const img    = getImg(key, curLvl || 1);

    let txt =
        `╭──────────────────╮\n` +
        `┃ ${data.emoji} *${data.name}*\n` +
        `╰──────────────────╯\n\n` +
        `📊 *المستوى:* ${curLvl}/${MAX_LEVEL}\n` +
        `📝 ${data.desc}\n\n`;

    if (curLvl < MAX_LEVEL) {
        const next   = curLvl + 1;
        const cost   = {
            gold:   data.cost.gold[next]   || 0,
            elixir: data.cost.elixir[next] || 0,
            gems:   data.cost.gems[next]   || 0,
        };
        const costTxt = [];
        if (cost.gold)   costTxt.push(`🪙 ${cost.gold}`);
        if (cost.elixir) costTxt.push(`⚡ ${cost.elixir}`);
        if (cost.gems)   costTxt.push(`💎 ${cost.gems}`);

        txt +=
            `*⬆️ للترقية للمستوى ${next}:*\n` +
            `${costTxt.join(' + ')}\n\n` +
            `*.طور ${data.name}*`;
    } else {
        txt += `*✅ وصلت الحد الأقصى!*`;
    }

    await conn.sendMessage(m.chat, { image: { url: img }, caption: txt }, { quoted: m });
};

// ══ Main Handler ══
const handler = async (m, { conn, command, args, text }) => {
    const jid = m.sender;
    if (!isRegistered(jid)) return m.reply('*❌ سجل الأول:* *.تسجيل*');
    const p = getPlayer(jid);

    switch (command) {

        // ─ عرض كل المباني ─
        case 'مبانيه': case 'مبانياتي': case 'buildings': {
            const lines = Object.entries(p.buildings).map(([key, lvl]) => {
                const data = BUILDINGS_DATA[key];
                const bar  = '█'.repeat(lvl) + '░'.repeat(MAX_LEVEL - lvl);
                return `${data.emoji} *${data.name}*\n   [${bar}] ${lvl}/${MAX_LEVEL}`;
            });
            return m.reply(
                `╭──────────────────╮\n` +
                `┃ 🏗️ *مبانيك*\n` +
                `╰──────────────────╯\n\n` +
                lines.join('\n\n') + '\n\n' +
                `*.مبنى <اسم>* لعرض التفاصيل\n` +
                `*.طور <اسم>* للترقية`
            );
        }

        // ─ عرض مبنى معين ─
        case 'مبنى': case 'building': {
            const arg = (text || '').trim().toLowerCase();
            const key = BUILDING_ALIASES[arg] || arg;
            if (!BUILDINGS_DATA[key]) {
                return m.reply(
                    `*❌ مبنى مش موجود*\n\n` +
                    `*المباني المتاحة:*\n` +
                    Object.entries(BUILDINGS_DATA)
                        .map(([k,d]) => `${d.emoji} ${d.name} ← \`${k}\``)
                        .join('\n')
                );
            }
            return showBuilding(m, conn, p, key);
        }

        // ─ ترقية مبنى ─
        case 'طور': case 'ترقية': case 'upgrade': {
            const arg = (text || '').trim().toLowerCase();
            if (!arg) {
                return m.reply(
                    `*📌 مثال:* \`.طور قلعة\`\n\n` +
                    `*المباني:*\n` +
                    Object.entries(BUILDINGS_DATA)
                        .map(([,d]) => `${d.emoji} ${d.name}`)
                        .join('\n')
                );
            }
            const key = BUILDING_ALIASES[arg] || arg;
            if (!BUILDINGS_DATA[key]) return m.reply(`*❌ مبنى مش موجود:* ${arg}`);

            const check = canUpgrade(p, key);
            if (!check.ok) {
                return m.reply(`*❌ ${check.reason}*`);
            }

            // خصم التكلفة وترقية
            deductCost(p, check.cost);
            p.buildings[key] = check.nextLvl;

            const data = BUILDINGS_DATA[key];
            const img  = getImg(key, check.nextLvl);

            await conn.sendMessage(m.chat, {
                image: { url: img },
                caption:
                    `*✅ تم الترقية!*\n\n` +
                    `${data.emoji} *${data.name}*\n` +
                    `المستوى ${check.nextLvl - 1} ⟶ *${check.nextLvl}*\n\n` +
                    `🪙 ${p.gold} ┃ ⚡ ${p.elixir} ┃ 💎 ${p.gems}`
            }, { quoted: m });
            break;
        }

        // ─ بناء مبنى جديد (مستوى 0 → 1) ─
        case 'بنى': case 'بناء': case 'build': {
            const arg = (text || '').trim().toLowerCase();
            if (!arg) return m.reply(`*📌 مثال:* \`.بنى مستشفى\``);
            const key = BUILDING_ALIASES[arg] || arg;
            if (!BUILDINGS_DATA[key]) return m.reply(`*❌ مبنى مش موجود:* ${arg}`);
            if (p.buildings[key] > 0) {
                return m.reply(`*ℹ️ ${getBuildingEmoji(key)} ${getBuildingName(key)} مبنى بالفعل - استخدم* \`.طور ${arg}\``);
            }
            // بناء = ترقية من 0 لـ 1
            const tempP = { ...p, buildings: { ...p.buildings, [key]: 0 } };
            const check = canUpgrade({ ...p, buildings: { ...p.buildings, [key]: 0 } }, key);
            if (!check.ok) return m.reply(`*❌ ${check.reason}*`);

            deductCost(p, check.cost);
            p.buildings[key] = 1;

            const data = BUILDINGS_DATA[key];
            const img  = getImg(key, 1);
            await conn.sendMessage(m.chat, {
                image: { url: img },
                caption:
                    `*✅ تم البناء!*\n\n` +
                    `${data.emoji} *${data.name}* - المستوى 1\n\n` +
                    `🪙 ${p.gold} ┃ ⚡ ${p.elixir} ┃ 💎 ${p.gems}`
            }, { quoted: m });
            break;
        }
    }
};

handler.usage    = ['مبانيه', 'مبنى', 'طور', 'بنى'];
handler.category = 'dev';
handler.command  = ['مبانيه','مبانياتي','buildings','مبنى','building','طور','ترقية','upgrade','بنى','بناء','build'];

export default handler;
