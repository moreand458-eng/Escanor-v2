const ESCANOR_CHANNEL = '120363422581600030@newsletter';

const handler = async (m, { conn, command, text }) => {

    if (command === 'انضم_القناة' || command === 'join_channel') {
        // استخرج الـ newsletterJid من الرابط أو النص
        let channelJid = ESCANOR_CHANNEL;
        if (text?.trim()) {
            const t = text.trim();
            // لو رابط invite
            if (t.includes('chat.whatsapp.com') || t.includes('whatsapp.com/channel')) {
                // استخدم الرابط مباشرة للانضمام
                try {
                    await conn.sendMessage(m.chat, {
                        text: `⏳ *جاري الانضمام...*`
                    });
                    // محاولة accept invite
                    const code = t.split('/').pop().split('?')[0];
                    await conn.groupAcceptInvite(code);
                    return m.reply('✅ *تم الانضمام بنجاح!*');
                } catch (e) {
                    return m.reply(`*❌ فشل الانضمام:* ${e.message?.slice(0, 80)}`);
                }
            }
            if (t.includes('@newsletter')) channelJid = t;
        }

        try {
            // الطريقة الصحيحة لـ followNewsletter
            await conn.newsletterFollow(channelJid);
            return m.reply(`✅ *تم الانضمام للقناة بنجاح!*\n📢 ${channelJid}`);
        } catch {
            try {
                // fallback
                await conn.followNewsletter(channelJid);
                return m.reply(`✅ *تم الانضمام للقناة!*`);
            } catch (e2) {
                return m.reply(`*❌ فشل الانضمام:* ${e2.message?.slice(0, 80)}`);
            }
        }
    }

    if (command === 'تفاعل_القناة' || command === 'channel_react') {
        const val = text?.trim()?.toLowerCase();
        if (!global._channelReact) global._channelReact = {};

        if (val === 'on' || val === 'تشغيل') {
            global._channelReact[ESCANOR_CHANNEL] = true;
            return m.reply('✅ *تم تفعيل التفاعل التلقائي مع القناة*');
        }
        if (val === 'off' || val === 'ايقاف') {
            delete global._channelReact[ESCANOR_CHANNEL];
            return m.reply('✅ *تم إيقاف التفاعل*');
        }
        return m.reply(
            `*📢 أوامر القناة:*\n\n` +
            `*.انضم_القناة* → ينضم للقناة\n` +
            `*.تفاعل_القناة on/off* → التفاعل\n\n` +
            `الحالة: ${global._channelReact?.[ESCANOR_CHANNEL] ? '✅ مفعل' : '❌ مطفي'}`
        );
    }
};

handler.command  = ['انضم_القناة', 'join_channel', 'تفاعل_القناة', 'channel_react'];
handler.usage    = ['انضم_القناة', 'تفاعل_القناة on/off'];
handler.owner    = true;
handler.category = 'settings';
export default handler;
