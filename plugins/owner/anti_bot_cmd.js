const handler = async (m, { command, text }) => {
    const detector = global._botDetector;
    if (!detector) return m.reply('*❌ مكتبة كشف البوتات غير محملة*');

    const val = text?.trim()?.toLowerCase();

    if (val === 'on' || val === 'تشغيل') {
        detector.enableAntiBotMode();
        return m.reply('✅ *تم تفعيل وضع الطرد الفوري للبوتات*\n⚡ أي بوت = طرد فوري');
    }

    if (val === 'off' || val === 'ايقاف') {
        detector.disableAntiBotMode();
        return m.reply('✅ *تم تعطيل وضع الطرد الفوري*\n> سيتم الإنذار 3 مرات ثم طرد');
    }

    return m.reply(
        `*🤖 وضع منع البوتات:*\n\n` +
        `الحالة: ${detector.antiBotMode ? '✅ طرد فوري' : '⚠️ إنذار 3 مرات'}\n\n` +
        `*.ضد_البوتات on* → طرد فوري\n` +
        `*.ضد_البوتات off* → إنذار 3 مرات`
    );
};

handler.command  = ['ضد_البوتات', 'anti_bot_mode'];
handler.usage    = ['ضد_البوتات on/off'];
handler.owner    = true;
handler.category = 'settings';
export default handler;
