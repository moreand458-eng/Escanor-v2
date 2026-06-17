// قبول / دعوه / تجديد
const handler = async (m, { conn, command, text }) => {
    if (command === 'قبول') {
        // قبول طلبات الانضمام
        try {
            await conn.groupRequestParticipantsList(m.chat).then(async (reqs) => {
                if (!reqs?.length) return m.reply('*لا يوجد طلبات انضمام*');
                for (const r of reqs) {
                    try { await conn.groupRequestParticipantsUpdate(m.chat, [r.jid], 'approve'); } catch {}
                }
                return m.reply(`*✅ تم قبول ${reqs.length} طلب انضمام*`);
            });
        } catch {
            m.reply('*❌ لا يوجد طلبات انضمام*');
        }
        return;
    }

    if (command === 'دعوه') {
        // إرسال دعوة لشخص
        const target = m.mentionedJid?.[0] || (text ? text.trim() + '@s.whatsapp.net' : null);
        if (!target) return m.reply('*مثال:* .دعوه @شخص');
        try {
            const code = await conn.groupInviteCode(m.chat);
            const link = `https://chat.whatsapp.com/${code}`;
            await conn.sendMessage(target, {
                text: `📨 *دعوة للانضمام*\n\n${link}`
            });
            return m.reply(`*✅ تم إرسال الدعوة*`);
        } catch { m.reply('*❌ تعذر الإرسال*'); }
        return;
    }

    if (command === 'تجديد') {
        // تجديد رابط الجروب
        try {
            await conn.groupRevokeInvite(m.chat);
            const newCode = await conn.groupInviteCode(m.chat);
            return conn.sendMessage(m.chat, {
                text: `🔄 *تم تجديد رابط الجروب*\n\nhttps://chat.whatsapp.com/${newCode}`
            }, { quoted: m });
        } catch { m.reply('*❌ تعذر التجديد*'); }
    }
};
handler.command  = ['قبول', 'دعوه', 'تجديد'];
handler.usage    = ['قبول', 'دعوه', 'تجديد'];
handler.admin    = true;
handler.botAdmin = true;
handler.category = 'admins';
export default handler;
