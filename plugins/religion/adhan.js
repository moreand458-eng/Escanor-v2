import { writeFileSync, readFileSync, existsSync } from 'fs';

const ADHAN_FILE = './system/adhan_config.json';
const loadConfig = () => {
    try { return existsSync(ADHAN_FILE) ? JSON.parse(readFileSync(ADHAN_FILE, 'utf-8')) : {}; } catch { return {}; }
};
const saveConfig = (data) => {
    try { writeFileSync(ADHAN_FILE, JSON.stringify(data, null, 2)); } catch {}
};

const PRAYER_NAMES = { Fajr: 'الفجر', Sunrise: 'الشروق', Dhuhr: 'الظهر', Asr: 'العصر', Maghrib: 'المغرب', Isha: 'العشاء' };

const getPrayerTimes = async (city) => {
    const res = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=&method=4`,
        { signal: AbortSignal.timeout(10000) }
    );
    const data = await res.json();
    if (data.code !== 200) throw new Error('City not found');
    return data.data.timings;
};

const handler = async (m, { conn, command, text, args }) => {

    // .مواقيت القاهرة
    if (command === 'مواقيت') {
        const city = text?.trim() || 'Cairo';
        try {
            const t = await getPrayerTimes(city);
            await conn.sendMessage(m.chat, {
                text:
                    `🕌 *مواقيت الصلاة - ${city}*\n\n` +
                    `🌅 الفجر:   *${t.Fajr}*\n` +
                    `☀️ الشروق: *${t.Sunrise}*\n` +
                    `🌞 الظهر:  *${t.Dhuhr}*\n` +
                    `🌤️ العصر:  *${t.Asr}*\n` +
                    `🌆 المغرب: *${t.Maghrib}*\n` +
                    `🌙 العشاء: *${t.Isha}*\n\n` +
                    `> _اللهم أعنا على ذكرك وشكرك وحسن عبادتك_ 🤲`
            }, { quoted: m });
        } catch {
            await m.reply('*❌ لم يتم العثور على المدينة*\nمثال: .مواقيت القاهرة');
        }
        return;
    }

    // .اذان - تفعيل تذكير الصلاة
    if (command === 'اذان') {
        const city = text?.trim();
        if (!city) {
            const cfg = loadConfig();
            const chatCfg = cfg[m.chat];
            if (chatCfg?.city) {
                return m.reply(
                    `🕌 *تذكير الصلاة مفعل*\n\n` +
                    `📍 المدينة: *${chatCfg.city}*\n` +
                    `🔒 قفل الجروب: ${chatCfg.lockGroup ? '✅' : '❌'}\n\n` +
                    `لإيقافه: *.اذان_ايقاف*\n` +
                    `لتفعيل القفل: *.اذان_قفل ${chatCfg.city}*`
                );
            }
            return m.reply(
                `*مثال:* .اذان القاهرة\n` +
                `*مع القفل:* .اذان_قفل القاهرة\n` +
                `*مواقيت:* .مواقيت القاهرة`
            );
        }

        // تحقق إن المدينة صح
        try {
            await getPrayerTimes(city);
        } catch {
            return m.reply(`*❌ مدينة غير موجودة:* ${city}`);
        }

        const cfg = loadConfig();
        cfg[m.chat] = { city, lockGroup: false, active: true };
        saveConfig(cfg);

        await m.reply(
            `✅ *تم تفعيل تذكير الصلاة*\n\n` +
            `📍 المدينة: *${city}*\n\n` +
            `لتفعيل قفل الجروب أثناء الصلاة:\n` +
            `*.اذان_قفل ${city}*`
        );
        return;
    }

    // .اذان_قفل - تفعيل مع قفل الجروب
    if (command === 'اذان_قفل') {
        const city = text?.trim();
        if (!city) return m.reply('*مثال:* .اذان_قفل القاهرة');
        try { await getPrayerTimes(city); } catch { return m.reply('*❌ مدينة غير موجودة*'); }

        const cfg = loadConfig();
        cfg[m.chat] = { city, lockGroup: true, active: true };
        saveConfig(cfg);

        await m.reply(
            `✅ *تم تفعيل تذكير الصلاة مع قفل الجروب*\n\n` +
            `📍 المدينة: *${city}*\n` +
            `🔒 الجروب سيُقفل عند الأذان ويُفتح بعد 30 دقيقة`
        );
        return;
    }

    // .اذان_ايقاف
    if (command === 'اذان_ايقاف') {
        const cfg = loadConfig();
        if (cfg[m.chat]) {
            delete cfg[m.chat];
            saveConfig(cfg);
            return m.reply('✅ *تم إيقاف تذكير الصلاة*');
        }
        return m.reply('*❌ التذكير غير مفعل في هذا الجروب*');
    }
};

handler.command  = ['اذان', 'مواقيت', 'اذان_قفل', 'اذان_ايقاف'];
handler.usage    = ['اذان', 'مواقيت'];
handler.admin    = true;
handler.category = 'religion';
export default handler;
