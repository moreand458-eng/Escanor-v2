// نظام البلاغات والأدمن
const isOwner = (id, bot) => bot?.config?.owners?.some(o => o.jid === id || o.lid === id);

const handler = async (m, { conn, command, text, bot }) => {

    if (command === 'report' || command === 'بلاغ') {
        const target = m.mentionedJid?.[0] || m.quoted?.sender;
        if (!target) return m.reply('*منشن العضو أو رد على رسالته*');

        try {
            const meta = await conn.groupMetadata(m.chat);
            const admins = meta.participants.filter(p => p.admin).map(p => p.id);

            await conn.sendMessage(m.chat, {
                text:
                    `🚨 *بلاغ جديد*\n\n` +
                    `📢 المُبلِّغ: @${m.sender.split('@')[0]}\n` +
                    `🎯 المُبلَّغ عنه: @${target.split('@')[0]}\n` +
                    `📝 السبب: ${text || 'لم يُحدد'}\n\n` +
                    `👑 الادمنية: ${admins.map(a => `@${a.split('@')[0]}`).join(' ')}`,
                mentions: [m.sender, target, ...admins]
            }, { quoted: m });
        } catch { m.reply('*❌ تعذر إرسال البلاغ*'); }
        return;
    }

    if (command === 'admins' || command === 'الادمنية') {
        try {
            const meta = await conn.groupMetadata(m.chat);
            const admins = meta.participants.filter(p => p.admin);
            if (!admins.length) return m.reply('*لا يوجد ادمن في الجروب*');

            const list = admins.map((a, i) =>
                `${i+1}. @${a.id.split('@')[0]} ${a.admin === 'superadmin' ? '👑' : '⚡'}`
            ).join('\n');

            await conn.sendMessage(m.chat, {
                text: `👑 *الادمنية (${admins.length}):*\n\n${list}`,
                mentions: admins.map(a => a.id)
            }, { quoted: m });
        } catch { m.reply('*❌ تعذر جلب البيانات*'); }
        return;
    }

    if (command === 'groupinfo' || command === 'info_group') {
        try {
            const meta = await conn.groupMetadata(m.chat);
            const admins = meta.participants.filter(p => p.admin).length;
            const g = global._gs?.[m.chat] || {};
            const created = new Date(meta.creation * 1000).toLocaleDateString('ar-EG');

            await conn.sendMessage(m.chat, {
                text:
                    `╭─┈─┈─┈─⟞📋⟝─┈─┈─┈─╮\n` +
                    `┃ *معلومات الجروب*\n` +
                    `╰─┈─┈─┈─⟞📋⟝─┈─┈─┈─╯\n\n` +
                    `📌 الاسم: ${meta.subject}\n` +
                    `👥 الأعضاء: ${meta.participants.length}\n` +
                    `👑 الادمن: ${admins}\n` +
                    `📅 تاريخ الإنشاء: ${created}\n` +
                    `🔒 الحالة: ${meta.announce ? 'مقفل' : 'مفتوح'}\n` +
                    `🛡️ مستوى الحماية: ${g.securityLevel ? `Level ${g.securityLevel}` : 'غير محدد'}\n` +
                    `⚠️ الإنذارات: ${Object.keys(g.warnings || {}).length} عضو\n` +
                    `🚫 المحظورين: ${(g.banned || []).length}`
            }, { quoted: m });
        } catch { m.reply('*❌ تعذر جلب البيانات*'); }
        return;
    }

    if (command === 'listwarn' || command === 'كل_الانذارات') {
        const warnings = global._gs?.[m.chat]?.warnings || {};
        const list = Object.entries(warnings).filter(([, v]) => v > 0);
        if (!list.length) return m.reply('*✅ لا يوجد إنذارات*');
        const text2 = list.map(([id, cnt], i) =>
            `${i+1}. @${id.split('@')[0]}: ${'⚠️'.repeat(cnt)} (${cnt}/3)`
        ).join('\n');
        return conn.sendMessage(m.chat, {
            text: `📋 *كل الإنذارات:*\n\n${text2}`,
            mentions: list.map(([id]) => id)
        }, { quoted: m });
    }
};

handler.command  = ['report', 'بلاغ', 'admins', 'الادمنية', 'groupinfo', 'info_group', 'listwarn', 'كل_الانذارات'];
handler.usage    = ['report', 'admins', 'groupinfo'];
handler.admin    = true;
handler.category = 'protection';
export default handler;
