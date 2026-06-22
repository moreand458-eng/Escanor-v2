// protection_stats.js - إحصائيات الحماية
// .احصائيات_الحماية -> إحصائيات الجروب الحالي (محظورين/مكتومين/تحذيرات/رسائل ممسوحة بالجروب)
// .احصائيات_عامه    -> إحصائيات شاملة على كل البوت (للمطورين بس)
import { getG, isOwnerFn, canUseAdminCmd, numOf } from '../../system/admin_utils.js';
import { adminGuard, notAuthMsg } from '../../system/bot_protection.js';
import { getGlobalStore, getRecentDeletions } from '../../system/content_control.js';

const listMentions = (list = [], max = 15) => {
    if (!list.length) return '> لا يوجد';
    const shown = list.slice(0, max);
    const txt = shown.map((id, i) => `${i + 1}. @${numOf(id)}`).join('\n');
    return list.length > max ? `${txt}\n> ...وكمان ${list.length - max}` : txt;
};

const handler = async (m, { conn, bot, command }) => {
    // ===== إحصائيات الجروب الحالي =====
    if (command === 'احصائيات_الحماية') {
        if (!m.isGroup) return m.reply('*❌ في الجروبات بس*');
        await adminGuard(m, { conn, bot });
        if (!canUseAdminCmd(m, bot, conn)) return m.reply(notAuthMsg());

        const g = getG(m.chat);
        const banned = g.banned || [];
        const muted  = g.mute   || [];
        const warns  = Object.entries(g.warnings || {}).filter(([, c]) => c > 0);
        const recent = getRecentDeletions(m.chat, 5);

        const mentions = [...new Set([...banned, ...muted, ...warns.map(w => w[0])])];

        let txt = `🛡️ *إحصائيات الحماية - الجروب ده*\n\n`;
        txt += `🚫 *المحظورين (${banned.length}):*\n${listMentions(banned)}\n\n`;
        txt += `🔇 *المكتومين (${muted.length}):*\n${listMentions(muted)}\n\n`;
        txt += `⚠️ *عندهم تحذيرات (${warns.length}):*\n`;
        txt += warns.length
            ? warns.map(([id, c]) => `@${numOf(id)} - ${c} تحذير`).join('\n')
            : '> لا يوجد';
        txt += `\n\n🗑️ *آخر رسائل اتمسحت بالجروب:*\n`;
        txt += recent.length
            ? recent.map(d => `• @${numOf(d.sender)} - ${d.reason}`).join('\n')
            : '> لا يوجد';

        return conn.sendMessage(m.chat, { text: txt, mentions }, { quoted: m });
    }

    // ===== إحصائيات عامة على كل البوت (للمطورين) =====
    if (command === 'احصائيات_عامه' || command === 'احصائيات_عامة') {
        if (!isOwnerFn(m.sender, bot, conn)) return m.reply(notAuthMsg());

        const gg = getGlobalStore();
        const bannedGlobal = gg.bannedGlobal || [];
        const mutedGlobal  = gg.mutedGlobal  || [];

        // إجمالي المحظورين/المكتومين على مستوى كل الجروبات (مش العام بس)
        let totalGroupBanned = 0, totalGroupMuted = 0, groupsCount = 0;
        for (const [chatId, g] of Object.entries(global._gs || {})) {
            if (chatId === '__global' || chatId === '__system') continue;
            groupsCount++;
            totalGroupBanned += (g.banned || []).length;
            totalGroupMuted  += (g.mute   || []).length;
        }

        const totalDeleted = Object.values(gg.deletedCounts || {}).reduce((a, b) => a + b, 0);
        const topDeleted = Object.entries(gg.deletedCounts || {})
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        let txt = `📊 *إحصائيات الحماية العامة - كل البوت*\n\n`;
        txt += `🌍 *محظورين عالميًا:* ${bannedGlobal.length}\n`;
        txt += `${listMentions(bannedGlobal, 10)}\n\n`;
        txt += `🌍 *مكتومين عالميًا:* ${mutedGlobal.length}\n`;
        txt += `${listMentions(mutedGlobal, 10)}\n\n`;
        txt += `👥 *جروبات فيها حظر/كتم محلي:* ${groupsCount}\n`;
        txt += `🚫 محظورين محليًا (إجمالي): ${totalGroupBanned}\n`;
        txt += `🔇 مكتومين محليًا (إجمالي): ${totalGroupMuted}\n\n`;
        txt += `🗑️ *إجمالي الرسائل المحذوفة:* ${totalDeleted}\n`;
        txt += topDeleted.length
            ? `*أكتر مستخدمين اتمسحلهم رسايل:*\n` +
              topDeleted.map(([id, c], i) => `${i + 1}. @${numOf(id)} - ${c} رسالة`).join('\n')
            : '> لا يوجد';

        const mentions = [...new Set([...bannedGlobal, ...mutedGlobal, ...topDeleted.map(t => t[0])])];
        return conn.sendMessage(m.chat, { text: txt, mentions }, { quoted: m });
    }
};

handler.command  = ['احصائيات_الحماية', 'احصائيات_عامه', 'احصائيات_عامة'];
handler.usage    = ['احصائيات_الحماية', 'احصائيات_عامه'];
handler.category = 'protection';
export default handler;
