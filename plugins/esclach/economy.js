// ════════════════════════════════════════
//  economy.js - نظام العملات والمنجم
//  ESCANOR CLASH System
// ════════════════════════════════════════

import {
    getDB, getPlayer, isRegistered,
    calcMineProduction, BUILDINGS_DATA
} from './db.js';

const MINE_COOLDOWN   = 2  * 60 * 60 * 1000; // ساعتين
const GEM_COOLDOWN    = 12 * 60 * 60 * 1000; // 12 ساعة
const CMD_POINTS      = 10;
const CMD_THRESHOLD   = 15;

// ══ جمع من المنجم ══
const collectMine = (p) => {
    const now        = Date.now();
    const lastMine   = p.stats.lastMine || 0;
    const elapsed    = now - lastMine;
    const cooldown   = p.buildings.gemMine > 0 ? GEM_COOLDOWN : MINE_COOLDOWN;

    if (elapsed < cooldown) {
        const rem = Math.ceil((cooldown - elapsed) / 60000);
        return { ok: false, rem };
    }

    const prod       = calcMineProduction(p);
    // كميه الإنتاج بتتحسب على الوقت اللي عدى
    const hours      = Math.min(elapsed / (1000 * 60 * 60), 12);
    const gained     = {
        gold:   Math.floor(prod.gold   * (hours / 2)),
        elixir: Math.floor(prod.elixir * (hours / 2)),
        gems:   Math.floor(prod.gems   * (hours / 12)),
    };

    p.gold   += gained.gold;
    p.elixir += gained.elixir;
    p.gems   += gained.gems;
    p.stats.lastMine = now;

    return { ok: true, gained };
};

// ══ daily reward ══
const DAILY_REWARD = { gold: 200, elixir: 100, gems: 2 };
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

const claimDaily = (p) => {
    const now  = Date.now();
    const last = p.stats.lastDaily || 0;
    if (now - last < DAILY_COOLDOWN) {
        const rem = Math.ceil((DAILY_COOLDOWN - (now - last)) / 3600000);
        return { ok: false, rem };
    }
    p.gold   += DAILY_REWARD.gold;
    p.elixir += DAILY_REWARD.elixir;
    p.gems   += DAILY_REWARD.gems;
    p.stats.lastDaily = now;
    return { ok: true, reward: DAILY_REWARD };
};

// ══ Main Handler ══
const handler = async (m, { conn, command, args, bot }) => {
    const jid = m.sender;
    if (!isRegistered(jid)) return m.reply('*❌ سجل الأول:* *.تسجيل*');
    const p = getPlayer(jid);

    switch (command) {

        // ─ عرض العملات ─
        case 'عملاتي': case 'رصيدي': case 'balance': {
            return m.reply(
                `╭──────────────────╮\n` +
                `┃ 💰 *رصيدك الحالي*\n` +
                `╰──────────────────╯\n\n` +
                `🪙 *ذهب:*   ${p.gold.toLocaleString()}\n` +
                `⚡ *إكسير:* ${p.elixir.toLocaleString()}\n` +
                `💎 *جواهر:* ${p.gems.toLocaleString()}\n\n` +
                `*.اجمع* ← تجميع إنتاج المناجم\n` +
                `*.daily* ← المكافأة اليومية`
            );
        }

        // ─ جمع من المناجم ─
        case 'اجمع': case 'collect': case 'منجم': {
            const res = collectMine(p);
            if (!res.ok) {
                return m.reply(
                    `*⏳ المنجم مش جاهز لسه*\n\n` +
                    `باقي *${res.rem}* دقيقة\n\n` +
                    `> المنجم بينتج كل ساعتين 🪙`
                );
            }
            const { gained } = res;
            const lines = [];
            if (gained.gold   > 0) lines.push(`🪙 +${gained.gold} ذهب`);
            if (gained.elixir > 0) lines.push(`⚡ +${gained.elixir} إكسير`);
            if (gained.gems   > 0) lines.push(`💎 +${gained.gems} جواهر`);
            return m.reply(
                `*✅ تم الجمع من المنجم!*\n\n` +
                lines.join('\n') + '\n\n' +
                `━━━━━━━━━━━\n` +
                `🪙 ${p.gold} ┃ ⚡ ${p.elixir} ┃ 💎 ${p.gems}`
            );
        }

        // ─ المكافأة اليومية ─
        case 'daily': case 'يومي': case 'مكافأة': {
            const res = claimDaily(p);
            if (!res.ok) {
                return m.reply(
                    `*⏳ خدت مكافأتك اليومية*\n\n` +
                    `باقي *${res.rem}* ساعة للمكافأة الجاية ⏰`
                );
            }
            return m.reply(
                `*🎁 مكافأة يومية!*\n\n` +
                `🪙 +${res.reward.gold} ذهب\n` +
                `⚡ +${res.reward.elixir} إكسير\n` +
                `💎 +${res.reward.gems} جواهر\n\n` +
                `━━━━━━━━━━━\n` +
                `رصيدك: 🪙 ${p.gold} ┃ ⚡ ${p.elixir} ┃ 💎 ${p.gems}`
            );
        }

        // ─ تحويل جواهر لذهب ─
        case 'صرف': case 'exchange': {
            const gems = parseInt(args[0]);
            if (!gems || gems < 1) return m.reply('*📌 مثال:* `.صرف 5` ← تحول 5 جواهر لذهب');
            if (p.gems < gems) return m.reply(`*❌ عندك ${p.gems} جواهر بس*`);
            const gold = gems * 100;
            p.gems  -= gems;
            p.gold  += gold;
            return m.reply(
                `*✅ تم الصرف!*\n\n` +
                `💎 ${gems} جواهر ⟶ 🪙 ${gold} ذهب\n\n` +
                `رصيدك: 🪙 ${p.gold} ┃ 💎 ${p.gems}`
            );
        }
    }
};

// ─ before hook: نقاط الأوامر التلقائية ─
handler.before = async (m, ctx, bot) => {
    if (!m.sender || !isRegistered(m.sender)) return false;
    const pfx    = (bot || ctx?.bot)?.config?.prefix || ['.','/',  '!'];
    const pfxArr = Array.isArray(pfx) ? pfx : [pfx];
    const body   = (m.body || '').trim();
    if (!pfxArr.some(p => body.startsWith(p))) return false;

    const p = getPlayer(m.sender);
    if (!p) return false;
    p.stats.cmdCount = (p.stats.cmdCount || 0) + 1;

    if (p.stats.cmdCount % CMD_THRESHOLD === 0) {
        p.gold = (p.gold || 0) + CMD_POINTS;
        try {
            await (ctx?.conn || ctx)?.sendMessage?.(m.chat, {
                text:
                    `*⚡ +${CMD_POINTS} ذهب!*\n` +
                    `وصلت ${p.stats.cmdCount} أمر 🎉\n` +
                    `🪙 رصيدك: *${p.gold}* ذهب`
            }, { quoted: m });
        } catch {}
    }
    return false;
};

handler.usage    = ['عملاتي', 'اجمع', 'daily', 'صرف'];
handler.category = 'dev';
handler.command  = ['عملاتي','رصيدي','balance','اجمع','collect','منجم','daily','يومي','مكافأة','صرف','exchange'];

export default handler;
