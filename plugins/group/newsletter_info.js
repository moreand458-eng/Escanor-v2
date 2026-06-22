/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 */

// .newsletter <رابط القناة أو الـ JID بتاعها زي 0123456789@newsletter>
// بيرجع تفاصيل القناة (الاسم/الوصف/المشتركين/تاريخ الإنشاء...)
const handler = async (m, { conn, text }) => {
    if (!text) return m.reply('*⚠️ ابعت رابط القناة أو الـ JID بتاعها*\n\nمثال:\n.newsletter https://whatsapp.com/channel/xxxx\n.newsletter 120363422581600030@newsletter');

    m.react('📡');
    try {
        const input = text.trim();

        // ===== تحديد النوع: jid مباشر ولا invite link/code =====
        let type, key;
        if (input.includes('@newsletter')) {
            type = 'jid';
            key = input;
        } else if (input.includes('http')) {
            type = 'invite';
            key = input.split('/').pop().split('?')[0];
        } else {
            type = 'invite';
            key = input;
        }

        const res = await conn.newsletterMetadata(type, key);
        const meta = res.thread_metadata || res;

        const name = meta.name?.text || meta.name || 'غير معروف';
        const desc = meta.description?.text || meta.description || 'مفيش وصف';
        const subs = meta.subscribers_count || meta.subscribersCount || '0';
        const created = meta.creation_time
            ? new Date(parseInt(meta.creation_time) * 1000).toLocaleString('ar-EG')
            : 'غير معروف';
        const status = res.state?.type || 'غير معروف';
        const verify = meta.verification || 'غير معروف';
        const jid = res.id || key;

        let msgText = `📡 *تفاصيل القناة*\n\n`;
        msgText += `👤 *الاسم:* ${name}\n`;
        msgText += `👥 *المشتركين:* ${subs}\n`;
        msgText += `📅 *تاريخ الإنشاء:* ${created}\n`;
        msgText += `📶 *الحالة:* ${status}\n`;
        msgText += `✔️ *التوثيق:* ${verify}\n`;
        msgText += `🆔 *الـ JID:* ${jid}\n\n`;
        msgText += `📝 *الوصف:*\n${desc}`;

        const img = meta.preview?.direct_path
            ? 'https://mmg.whatsapp.net' + meta.preview.direct_path
            : null;

        try {
            await conn.sendButton(m.chat, {
                imageUrl: img,
                bodyText: msgText,
                footerText: 'ESCANOR ~ ES1',
                buttons: [{ name: 'cta_copy', params: { display_text: '📋 نسخ الـ JID', copy_code: jid } }],
                mentions: [m.sender],
                newsletter: { name, jid },
                interactiveConfig: { buttons_limits: 1, list_title: name, button_title: 'Options' }
            }, { quoted: m });
        } catch {
            // fallback لو sendButton فشل لأي سبب (نسخة baileys مختلفة مثلاً)
            await conn.sendMessage(m.chat, { text: msgText }, { quoted: m });
        }

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply('*❌ معرفتش أجيب تفاصيل القناة. تأكد إن الرابط/الـ JID صح*');
    }
};

handler.usage = ['newsletter <رابط أو jid القناة>'];
handler.command = ['newsletter', 'قناة_تفاصيل'];
handler.category = 'group';

export default handler;
