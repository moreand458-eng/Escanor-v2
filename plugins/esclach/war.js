// ════════════════════════════════════════
//  war.js - نظام الحرب والمهاجمة
//  ESCANOR CLASH System
// ════════════════════════════════════════

import {
    getDB, getPlayer, isRegistered,
    calcPower, calcProtected,
    ARMY_DATA, BUILDINGS_DATA
} from './db.js';

const ATTACK_COOLDOWN = 30 * 60 * 1000; // 30 دقيقة بين كل هجوم
const SHIELD_DURATION = 8  * 60 * 60 * 1000; // درع 8 ساعات بعد الخسارة

// ══ حساب نتيجة المعركة ══
const battle = (attacker, defender) => {
    const atkPower = calcPower(attacker);
    const defPower = calcPower(defender) * 1.2; // الدفاع أقوى بـ 20%

    // عشوائية 10%
    const rand    = 0.9 + Math.random() * 0.2;
    const atkFinal = atkPower * rand;

    const win = atkFinal > defPower;

    // خسائر الجيش
    const lossRate = win ? 0.1 : 0.4;
    const saved    = BUILDINGS_DATA.hospital.save[defender.buildings.hospital] / 100;

    return { win, atkPower, defPower: Math.floor(defPower / 1.2), lossRate, saved };
};

// ══ حساب الغنائم ══
const calcLoot = (defender, win) => {
    if (!win) return { gold: 0, elixir: 0, gems: 0 };
    const protection = calcProtected(defender) / 100;
    const available  = {
        gold:   Math.floor(defender.gold   * (1 - protection) * 0.3),
        elixir: Math.floor(defender.elixir * (1 - protection) * 0.3),
        gems:   Math.floor(defender.gems   * (1 - protection) * 0.1),
    };
    return available;
};

// ══ تطبيق خسائر الجيش ══
const applyLosses = (p, lossRate, savedRate = 0) => {
    const losses = {};
    for (const [type, count] of Object.entries(p.army)) {
        if (!count) continue;
        const lost     = Math.floor(count * lossRate * (1 - savedRate));
        losses[type]   = lost;
        p.army[type]   = Math.max(0, count - lost);
    }
    return losses;
};

// ══ Main Handler ══
const handler = async (m, { conn, command, args, text, bot }) => {
    const jid = m.sender;
    if (!isRegistered(jid)) return m.reply('*❌ سجل الأول:* *.تسجيل*');
    const p   = getPlayer(jid);
    const db  = getDB();

    switch (command) {

        // ─ هجوم ─
        case 'هاجم': case 'attack': {
            // جيب المنشن
            const targetJid = m.mentionedJid?.[0] || m.quoted?.sender;
            if (!targetJid) return m.reply('*📌 مثال:* `.هاجم @شخص`');
            if (targetJid === jid) return m.reply('*❌ مش ممكن تهاجم نفسك*');
            if (!isRegistered(targetJid)) return m.reply('*❌ الشخص ده مش مسجل في اللعبة*');

            // cooldown المهاجم
            const lastAtk = p.stats?.lastAttack || 0;
            const now     = Date.now();
            if (now - lastAtk < ATTACK_COOLDOWN) {
                const rem = Math.ceil((ATTACK_COOLDOWN - (now - lastAtk)) / 60000);
                return m.reply(`*⏳ استنى ${rem} دقيقة قبل ما تهاجم تاني*`);
            }

            const defender = getPlayer(targetJid);

            // تحقق من الدرع
            if (defender.shield && now < defender.shield) {
                const remH = Math.ceil((defender.shield - now) / 3600000);
                return m.reply(`*🛡️ الشخص ده محمي بدرع لمدة ${remH} ساعة*`);
            }

            // تحقق إن المهاجم عنده جيش
            const atkTotal = Object.values(p.army).reduce((a, b) => a + b, 0);
            if (!atkTotal) return m.reply('*❌ ما عندكش جنود للهجوم!\n*.جند مشاة 10* للبداية');

            // المعركة
            const result = battle(p, defender);
            const loot   = calcLoot(defender, result.win);

            // تطبيق الخسائر
            const atkLosses = applyLosses(p, result.lossRate);
            const defLosses = applyLosses(defender, result.win ? 0.3 : 0.1, defender.buildings.hospital > 0 ? result.saved : 0);

            p.stats.lastAttack = now;

            if (result.win) {
                // الغنائم
                p.gold       += loot.gold;
                p.elixir     += loot.elixir;
                p.gems       += loot.gems;
                defender.gold   = Math.max(0, defender.gold   - loot.gold);
                defender.elixir = Math.max(0, defender.elixir - loot.elixir);
                defender.gems   = Math.max(0, defender.gems   - loot.gems);

                // إحصائيات
                p.stats.wins       = (p.stats.wins || 0) + 1;
                defender.stats.losses = (defender.stats.losses || 0) + 1;

                // درع للمخسور
                defender.shield = now + SHIELD_DURATION;

                // خسائر الجيش
                const lossLines = Object.entries(atkLosses)
                    .filter(([,v]) => v > 0)
                    .map(([t,v]) => `${ARMY_DATA[t].emoji} -${v} ${ARMY_DATA[t].name}`)
                    .join('\n') || '— لا خسائر —';

                const lootLines = [];
                if (loot.gold)   lootLines.push(`🪙 +${loot.gold} ذهب`);
                if (loot.elixir) lootLines.push(`⚡ +${loot.elixir} إكسير`);
                if (loot.gems)   lootLines.push(`💎 +${loot.gems} جواهر`);

                await conn.sendMessage(m.chat, {
                    text:
                        `*⚔️ نتيجة المعركة*\n\n` +
                        `*🏆 انتصرت!*\n\n` +
                        `💪 قوتك: ${result.atkPower}\n` +
                        `🛡️ قوة الخصم: ${result.defPower}\n\n` +
                        `*💰 الغنائم:*\n` +
                        (lootLines.join('\n') || '— لا غنائم —') + '\n\n' +
                        `*⚔️ خسائرك:*\n${lossLines}\n\n` +
                        `🛡️ الخصم اخد درع حماية 8 ساعات`,
                    contextInfo: { mentionedJid: [targetJid] }
                }, { quoted: m });

                // إشعار المهزوم
                try {
                    await conn.sendMessage(targetJid, {
                        text:
                            `*⚠️ تم مهاجمة قلعتك!*\n\n` +
                            `@${jid.split('@')[0]} هاجمك وانت خسرت\n\n` +
                            `*الخسائر:*\n` +
                            (lootLines.join('\n') || '—') + '\n\n' +
                            `🛡️ عندك درع حماية 8 ساعات دلوقتي`,
                        contextInfo: { mentionedJid: [jid] }
                    });
                } catch {}

            } else {
                // خسارة
                p.stats.losses     = (p.stats.losses || 0) + 1;
                defender.stats.wins = (defender.stats.wins || 0) + 1;

                const lossLines = Object.entries(atkLosses)
                    .filter(([,v]) => v > 0)
                    .map(([t,v]) => `${ARMY_DATA[t].emoji} -${v} ${ARMY_DATA[t].name}`)
                    .join('\n') || '— لا خسائر —';

                await conn.sendMessage(m.chat, {
                    text:
                        `*⚔️ نتيجة المعركة*\n\n` +
                        `*💀 خسرت!*\n\n` +
                        `💪 قوتك: ${result.atkPower}\n` +
                        `🛡️ قوة الخصم: ${result.defPower}\n\n` +
                        `*⚔️ خسائرك:*\n${lossLines}\n\n` +
                        `*.جند* لتجنيد جنود جدد`,
                    contextInfo: { mentionedJid: [targetJid] }
                }, { quoted: m });
            }
            break;
        }

        // ─ إحصائيات الحرب ─
        case 'حروبي': case 'wars': {
            return m.reply(
                `*⚔️ إحصائياتك*\n\n` +
                `🏆 *انتصارات:* ${p.stats.wins || 0}\n` +
                `💀 *هزائم:*    ${p.stats.losses || 0}\n` +
                `💪 *قوتك:*     ${calcPower(p)}\n\n` +
                `🛡️ *درعك:* ${p.shield && Date.now() < p.shield
                    ? `نشط (${Math.ceil((p.shield - Date.now()) / 3600000)} ساعة)`
                    : 'غير نشط'}`
            );
        }

        // ─ درع حماية بالجواهر ─
        case 'درع': case 'shield': {
            const hours = parseInt(args[0]) || 8;
            const cost  = Math.ceil(hours / 8); // جوهرة لكل 8 ساعات
            if (p.gems < cost) return m.reply(`*❌ محتاج ${cost} جواهر - عندك ${p.gems}*`);
            p.gems  -= cost;
            p.shield = Date.now() + hours * 3600000;
            return m.reply(
                `*🛡️ تم تفعيل الدرع!*\n\n` +
                `⏰ مدة الحماية: ${hours} ساعة\n` +
                `💎 باقي: ${p.gems} جواهر`
            );
        }

        // ─ ترتيب اللاعبين ─
        case 'ترتيب': case 'leaderboard': case 'top': {
            const entries = Object.entries(db)
                .filter(([,pl]) => pl?.stats)
                .map(([j, pl]) => ({ j, wins: pl.stats.wins || 0, power: calcPower(pl) }))
                .sort((a, b) => b.wins - a.wins || b.power - a.power)
                .slice(0, 10);

            if (!entries.length) return m.reply('*❌ مفيش لاعبين لحد دلوقتي*');
            const medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];
            let txt = '*🏆 ترتيب اللاعبين:*\n\n';
            entries.forEach(({ j, wins, power }, i) => {
                txt += `${medals[i]} @${j.split('@')[0]} ┃ ${wins} انتصار ┃ 💪${power}\n`;
            });
            await conn.sendMessage(m.chat, {
                text: txt,
                contextInfo: { mentionedJid: entries.map(e => e.j) }
            }, { quoted: m });
            break;
        }
    }
};

handler.usage    = ['هاجم', 'حروبي', 'درع', 'ترتيب'];
handler.category = 'dev';
handler.command  = ['هاجم','attack','حروبي','wars','درع','shield','ترتيب','leaderboard','top'];

export default handler;
