// ════════════════════════════════════════
//  missions.js - المهام اليومية والأسبوعية
//  ESCANOR CLASH System
// ════════════════════════════════════════

import { getPlayer, isRegistered, calcPower } from './db.js';

const DAILY_COOLDOWN  = 24 * 60 * 60 * 1000;
const WEEKLY_COOLDOWN = 7  * 24 * 60 * 60 * 1000;

// ══ المهام اليومية ══
const DAILY_MISSIONS = [
    {
        id: 'cmd15',
        name: '⚡ أكتب 15 أمر',
        desc: 'استخدم البوت 15 مرة',
        check: (p) => (p.stats.cmdCount || 0) % 15 === 0 && p.stats.cmdCount > 0,
        reward: { gold: 50, elixir: 20, gems: 0 },
    },
    {
        id: 'collect',
        name: '⛏️ اجمع من المنجم',
        desc: 'اجمع إنتاج المنجم مرة',
        check: (p) => {
            const last = p.stats.lastMine || 0;
            return Date.now() - last < DAILY_COOLDOWN;
        },
        reward: { gold: 30, elixir: 15, gems: 0 },
    },
    {
        id: 'train10',
        name: '🪖 جند 10 جنود',
        desc: 'جند 10 جنود في اليوم',
        check: (p) => (p.stats.dailyTrained || 0) >= 10,
        reward: { gold: 40, elixir: 30, gems: 0 },
    },
    {
        id: 'attack1',
        name: '⚔️ هاجم مرة',
        desc: 'هاجم لاعب تاني',
        check: (p) => {
            const last = p.stats.lastAttack || 0;
            return Date.now() - last < DAILY_COOLDOWN;
        },
        reward: { gold: 80, elixir: 40, gems: 1 },
    },
    {
        id: 'upgrade1',
        name: '🏗️ رقي مبنى',
        desc: 'رقي أي مبنى مرة في اليوم',
        check: (p) => {
            const last = p.stats.lastUpgrade || 0;
            return Date.now() - last < DAILY_COOLDOWN;
        },
        reward: { gold: 60, elixir: 30, gems: 0 },
    },
];

// ══ المهام الأسبوعية ══
const WEEKLY_MISSIONS = [
    {
        id: 'win5',
        name: '🏆 انتصر 5 مرات',
        desc: 'اكسب 5 معارك في الأسبوع',
        check: (p) => (p.stats.weeklyWins || 0) >= 5,
        reward: { gold: 500, elixir: 250, gems: 5 },
    },
    {
        id: 'train50',
        name: '⚔️ جند 50 جندي',
        desc: 'جند 50 جندي في الأسبوع',
        check: (p) => (p.stats.weeklyTrained || 0) >= 50,
        reward: { gold: 300, elixir: 400, gems: 3 },
    },
    {
        id: 'upgrade3',
        name: '🏗️ رقي 3 مباني',
        desc: 'رقي 3 مباني في الأسبوع',
        check: (p) => (p.stats.weeklyUpgrades || 0) >= 3,
        reward: { gold: 400, elixir: 200, gems: 4 },
    },
    {
        id: 'power1000',
        name: '💪 وصل قوة 1000',
        desc: 'جيشك يوصل قوة 1000',
        check: (p) => calcPower(p) >= 1000,
        reward: { gold: 600, elixir: 300, gems: 6 },
    },
];

// ══ عرض المهام ══
const showMissions = (p, type) => {
    const missions = type === 'daily' ? DAILY_MISSIONS : WEEKLY_MISSIONS;
    const doneKey  = type === 'daily' ? 'doneDailyMissions' : 'doneWeeklyMissions';
    const done     = p.stats[doneKey] || [];

    const lines = missions.map(ms => {
        const isDone      = done.includes(ms.id);
        const canClaim    = !isDone && ms.check(p);
        const rewardTxt   = [];
        if (ms.reward.gold)   rewardTxt.push(`🪙${ms.reward.gold}`);
        if (ms.reward.elixir) rewardTxt.push(`⚡${ms.reward.elixir}`);
        if (ms.reward.gems)   rewardTxt.push(`💎${ms.reward.gems}`);

        const status = isDone ? '✅' : canClaim ? '🎁 جاهزة!' : '⏳';
        return `${status} *${ms.name}*\n   ${ms.desc}\n   مكافأة: ${rewardTxt.join(' + ')}`;
    });

    return (
        `╭──────────────────╮\n` +
        `┃ 📋 *مهام ${type === 'daily' ? 'اليوم' : 'الأسبوع'}*\n` +
        `╰──────────────────╯\n\n` +
        lines.join('\n\n') + '\n\n' +
        `*.استلم_مهام* لاستلام المكافآت الجاهزة`
    );
};

// ══ Main Handler ══
const handler = async (m, { command }) => {
    const jid = m.sender;
    if (!isRegistered(jid)) return m.reply('*❌ سجل الأول:* *.تسجيل*');
    const p = getPlayer(jid);

    switch (command) {

        // ─ عرض المهام اليومية ─
        case 'مهام': case 'missions': case 'مهام_يومية': {
            return m.reply(showMissions(p, 'daily'));
        }

        // ─ عرض المهام الأسبوعية ─
        case 'مهام_اسبوعية': case 'weekly': {
            return m.reply(showMissions(p, 'weekly'));
        }

        // ─ استلام مكافآت المهام الجاهزة ─
        case 'استلم_مهام': case 'claim': {
            const allMissions = [...DAILY_MISSIONS, ...WEEKLY_MISSIONS];
            if (!p.stats.doneDailyMissions)  p.stats.doneDailyMissions  = [];
            if (!p.stats.doneWeeklyMissions) p.stats.doneWeeklyMissions = [];

            let totalGold = 0, totalElixir = 0, totalGems = 0;
            const claimed = [];

            for (const ms of DAILY_MISSIONS) {
                if (p.stats.doneDailyMissions.includes(ms.id)) continue;
                if (!ms.check(p)) continue;
                p.stats.doneDailyMissions.push(ms.id);
                totalGold   += ms.reward.gold;
                totalElixir += ms.reward.elixir;
                totalGems   += ms.reward.gems;
                claimed.push(ms.name);
            }

            for (const ms of WEEKLY_MISSIONS) {
                if (p.stats.doneWeeklyMissions.includes(ms.id)) continue;
                if (!ms.check(p)) continue;
                p.stats.doneWeeklyMissions.push(ms.id);
                totalGold   += ms.reward.gold;
                totalElixir += ms.reward.elixir;
                totalGems   += ms.reward.gems;
                claimed.push(ms.name);
            }

            if (!claimed.length) {
                return m.reply(
                    `*❌ مفيش مهام جاهزة دلوقتي*\n\n` +
                    `*.مهام* لعرض المهام اليومية\n` +
                    `*.مهام_اسبوعية* للأسبوعية`
                );
            }

            p.gold   += totalGold;
            p.elixir += totalElixir;
            p.gems   += totalGems;

            const rewardLines = [];
            if (totalGold)   rewardLines.push(`🪙 +${totalGold} ذهب`);
            if (totalElixir) rewardLines.push(`⚡ +${totalElixir} إكسير`);
            if (totalGems)   rewardLines.push(`💎 +${totalGems} جواهر`);

            return m.reply(
                `*🎁 تم استلام المكافآت!*\n\n` +
                `*المهام المكتملة:*\n` +
                claimed.map(n => `✅ ${n}`).join('\n') + '\n\n' +
                `*المكافآت:*\n` +
                rewardLines.join('\n') + '\n\n' +
                `━━━━━━━━━━━\n` +
                `🪙 ${p.gold} ┃ ⚡ ${p.elixir} ┃ 💎 ${p.gems}`
            );
        }

        // ─ ريست المهام اليومية (تلقائي كل 24 ساعة) ─
        case 'ريست_مهام': {
            if (!m.isOwner) return;
            const db = (await import('./db.js')).getDB();
            let count = 0;
            const now = Date.now();
            for (const pl of Object.values(db)) {
                if (!pl?.stats) continue;
                const last = pl.stats.lastDailyReset || 0;
                if (now - last >= DAILY_COOLDOWN) {
                    pl.stats.doneDailyMissions  = [];
                    pl.stats.dailyTrained       = 0;
                    pl.stats.lastDailyReset     = now;
                    count++;
                }
                if (now - (pl.stats.lastWeeklyReset || 0) >= WEEKLY_COOLDOWN) {
                    pl.stats.doneWeeklyMissions = [];
                    pl.stats.weeklyWins         = 0;
                    pl.stats.weeklyTrained      = 0;
                    pl.stats.weeklyUpgrades     = 0;
                    pl.stats.lastWeeklyReset    = now;
                }
            }
            return m.reply(`*✅ تم ريست مهام ${count} لاعب*`);
        }
    }
};

handler.usage    = ['مهام', 'مهام_اسبوعية', 'استلم_مهام'];
handler.category = 'dev';
handler.command  = [
    'مهام','missions','مهام_يومية',
    'مهام_اسبوعية','weekly',
    'استلم_مهام','claim',
    'ريست_مهام'
];

export default handler;
