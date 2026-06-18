// .kill      - يمسح جلستك (للبوتات الفرعية) بعد إرسال رسالة تنبيه
// .kill all  - للمطورين فقط: يمسح كل جلسات البوتات الفرعية بعد تنبيهها

const KILL_SELF_MSG =
`⛔انِـت دلوَقِـتي هتلغـِي⚠
 السَـجلۿہ الخـاصـِۿہ بَـيـگ خـد 『 *ليـنِـڪ جــروَبَ* 』
https://chat.whatsapp.com/Hd5SRXu6WRX5njUtvT9e9e
 التنِـصـِيـبَ لوَ ؏ـوَزت تنِـصـِبَ تانِـي 🔛🔰`;

const KILL_ALL_MSG =
`*⚠هيـتلغـِي جلسَـتـڪ⚠*
 *فـي البَـوَت مـن امـر مـن احـد المـطِـوَريـن خـد*  『 *ليـنِـڪ جـروَبَ*  』
https://chat.whatsapp.com/Hd5SRXu6WRX5njUtvT9e9e
*التنِـصـِيـبَ ؏ـشِـان تنِـصـِبَ تانِـي*⚙📡`;

const handler = async (m, { conn, bot, text }) => {
    const sub = global.subBots;
    if (!sub) return m.reply('*❌ نظام البوتات الفرعية غير متاح*');

    const arg = (text || '').trim().toLowerCase();

    /* ============ .kill all - للمطورين فقط ============ */
    if (arg === 'all') {
        if (!m.isOwner) return m.reply('*❌ الأمر ده للمطورين فقط*');

        const bots = sub.list();
        if (!bots.length) return m.reply('*📭 لا يوجد بوتات فرعية متصلة*');

        let warned = 0, removed = 0;

        // 1) تنبيه كل البوتات الفرعية قبل الحذف
        for (const b of bots) {
            if (b.id === bot.id) continue; // البوت الأساسي مش بيمسح نفسه
            try {
                const ownJid = b.phone ? `${b.phone}@s.whatsapp.net` : null;
                if (!ownJid) continue;

                const botConn = sub.get(b.id);
                const sock = botConn?.sock;

                if (sock) {
                    await sock.sendMessage(ownJid, { text: KILL_ALL_MSG });
                } else {
                    await conn.sendMessage(ownJid, { text: KILL_ALL_MSG });
                }
                warned++;
            } catch {}
        }

        await new Promise(r => setTimeout(r, 3000));

        // 2) حذف الجلسات
        for (const b of bots) {
            if (b.id === bot.id) continue;
            try {
                if (b.phone && (await sub.removeByPhone(b.phone))) removed++;
            } catch {}
        }

        return m.reply(`✅ *تم تنبيه ${warned} بوت وحذف ${removed} جلسة*`);
    }

    /* ============ .kill - مسح الجلسة الحالية ============ */
    const bots = sub.list();
    const me = bots.find(b => b.id === bot.id);

    if (!me) {
        return m.reply('*❌ الأمر ده للبوتات الفرعية بس*');
    }

    try {
        await conn.sendMessage(m.chat, { text: KILL_SELF_MSG });
    } catch {}

    await new Promise(r => setTimeout(r, 1500));

    try {
        if (me.phone) await sub.removeByPhone(me.phone);
    } catch {}
};

handler.usage    = ['kill', 'kill all'];
handler.category = 'sub';
handler.command  = ['kill'];
handler.noSub    = false;

export default handler;
