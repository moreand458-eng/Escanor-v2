// global_protection.js - حظر عام / كتم عام للمطورين بس
// بيشتغل على كل الجروبات اللي البوت فيها أدمن (البوت الرئيسي + كل البوتات الفرعية)
// 1) لما المطور يحظر/يكتم حد: بيتطرد/يتكتم فورًا من كل الجروبات الحالية اللي البوت أدمن فيها
// 2) لو دخل جروب تاني بعد كده أو بعت رسالة في أي جروب البوت فيه أدمن: بيتطرد/تتمسح رسايله تلقائي
import { isOwnerFn, isInList, removeFromList, updateParticipant, numOf } from '../../system/admin_utils.js';
import { isBotActualAdmin, checkCommandCooldown } from '../../system/bot_protection.js';
import { getGlobalStore, logAndDeleteMessage } from '../../system/content_control.js';

const ownerOnlyMsg = () => '*「🔥」 الامـر دا لـلـمـطـوريـن بـس يـسـطـا*';

// ===== يدور على كل الجروبات اللي بوت معين (main أو sub) أدمن فيها ويطرد التارجت =====
const purgeFromAllGroups = async (sock, target) => {
    let kicked = 0, checked = 0;
    try {
        const groups = await sock.groupFetchAllParticipating();
        const list = Object.values(groups || {});
        checked = list.length;

        for (const g of list) {
            try {
                const isAdmin = await isBotActualAdmin(g.id, sock);
                if (!isAdmin) continue;

                const meta = await sock.groupMetadata(g.id).catch(() => null);
                const inGroup = meta?.participants?.some(p =>
                    p.id === target || p.lid === target || p.jid === target || numOf(p.id) === numOf(target)
                );
                if (!inGroup) continue;

                const res = await updateParticipant(g.id, target, 'remove', sock);
                if (res.ok) kicked++;
            } catch {}
        }
    } catch {}
    return { kicked, checked };
};

const handler = async (m, { conn, bot, command }) => {
    if (!isOwnerFn(m.sender, bot, conn)) return m.reply(ownerOnlyMsg());

    const cooldown = checkCommandCooldown(command, m.sender, m.chat);
    if (!cooldown.allowed) return m.reply(`*⏳ استنى ${Math.ceil(cooldown.waitMs / 1000)} ثانية*`);

    const gg = getGlobalStore();
    const target = m.mentionedJid?.[0] || m.quoted?.sender;

    // ===== حظر عام =====
    if (command === 'حظر_عام' || command === 'global_ban' || command === 'حظر_شامل') {
        if (!target) return m.reply('*منشن العضو أو رد على رسالته*');
        if (isOwnerFn(target, bot, conn)) return m.reply('*مـقِـدرش احـظـر مـطِـوَري「🩸」*');

        if (isInList(gg.bannedGlobal, target)) return m.reply(`*❌ @${numOf(target)} محظور عالميًا بالفعل*`);
        gg.bannedGlobal.push(target);

        await m.reply(`🚫 *جاري حظر @${numOf(target)} من كل الجروبات...*`);

        let totalKicked = 0, totalChecked = 0;

        // البوت الرئيسي
        const r = await purgeFromAllGroups(conn, target);
        totalKicked += r.kicked; totalChecked += r.checked;

        // البوتات الفرعية لو موجودة
        try {
            const sub = global.subBots;
            if (sub?.list) {
                const bots = sub.list().filter(b => b.connected && b.id !== bot?.id);
                for (const b of bots) {
                    const sock = sub.get(b.id)?.sock;
                    if (!sock) continue;
                    const r2 = await purgeFromAllGroups(sock, target);
                    totalKicked += r2.kicked; totalChecked += r2.checked;
                }
            }
        } catch {}

        return conn.sendMessage(m.chat, {
            text:
                `🚫 *تم الحظر العام لـ @${numOf(target)}*\n\n` +
                `👢 تم طرده من *${totalKicked}* جروب (من أصل ${totalChecked} تم فحصها)\n` +
                `🛡️ هيتطرد تلقائيًا من أي جروب جديد البوت فيه أدمن`,
            mentions: [target]
        }, { quoted: m });
    }

    // ===== فك الحظر العام =====
    if (command === 'فك_حظر_عام' || command === 'unglobal_ban') {
        if (!target) return m.reply('*منشن العضو*');
        if (!isInList(gg.bannedGlobal, target)) return m.reply(`*❌ @${numOf(target)} مش محظور عالميًا*`);
        gg.bannedGlobal = removeFromList(gg.bannedGlobal, target);
        return conn.sendMessage(m.chat, {
            text: `✅ *تم فك الحظر العام عن @${numOf(target)}*`, mentions: [target]
        }, { quoted: m });
    }

    // ===== كتم عام =====
    if (command === 'كتم_عام' || command === 'global_mute') {
        if (!target) return m.reply('*منشن العضو أو رد على رسالته*');
        if (isOwnerFn(target, bot, conn)) return m.reply('*مـقِـدرش ا؏ـمـل مـيـوَت لمـطِـوَري「🔥」*');

        if (isInList(gg.mutedGlobal, target)) return m.reply(`*❌ @${numOf(target)} مكتوم عالميًا بالفعل*`);
        gg.mutedGlobal.push(target);

        return conn.sendMessage(m.chat, {
            text:
                `🔇 *تم كتم @${numOf(target)} عالميًا*\n` +
                `🔒 هتتمسح رسايله في أي جروب البوت فيه أدمن`,
            mentions: [target]
        }, { quoted: m });
    }

    // ===== فك الكتم العام =====
    if (command === 'فك_كتم_عام' || command === 'unglobal_mute') {
        if (!target) return m.reply('*منشن العضو*');
        if (!isInList(gg.mutedGlobal, target)) return m.reply(`*❌ @${numOf(target)} مش مكتوم عالميًا*`);
        gg.mutedGlobal = removeFromList(gg.mutedGlobal, target);
        return conn.sendMessage(m.chat, {
            text: `✅ *تم فك الكتم العام عن @${numOf(target)}*`, mentions: [target]
        }, { quoted: m });
    }
};

handler.command  = ['حظر_عام', 'فك_حظر_عام', 'كتم_عام', 'فك_كتم_عام'];
handler.usage    = ['حظر_عام @user', 'كتم_عام @user'];
handler.category = 'protection';

// ===== before hook: بيشتغل على كل رسالة جايه لأي بوت (رئيسي/فرعي) في أي جروب =====
handler.before = async (m, { conn, bot }) => {
    if (!m.isGroup) return false;
    if (isOwnerFn(m.sender, bot, conn)) return false;

    const gg = getGlobalStore();

    // ===== محظور عالميًا =====
    if (isInList(gg.bannedGlobal, m.sender)) {
        try {
            const isAdminNow = await isBotActualAdmin(m.chat, conn).catch(() => m.isBotAdmin);
            if (!isAdminNow) return false;
            const res = await updateParticipant(m.chat, m.sender, 'remove', conn);
            if (res.ok) {
                await conn.sendMessage(m.chat, {
                    text: `🚫 تم طرد @${numOf(m.sender)} تلقائياً (محظور عالميًا)`,
                    mentions: [m.sender]
                });
            }
        } catch {}
        return true;
    }

    // ===== مكتوم عالميًا =====
    if (isInList(gg.mutedGlobal, m.sender)) {
        await logAndDeleteMessage(m, conn, 'مكتوم عالميًا 🔇', { silent: true });
        return true;
    }

    return false;
};

export default handler;
