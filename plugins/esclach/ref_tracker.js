// ══ تتبع الإحالات تلقائياً ══
// لما حد يفتح البوت من رابط wa.me/?text=بوت_CODE

import { handleRef, encodeNum } from './castle.js';

const handler = async (m, { conn, bot }) => {
    const body = (m.body || m.text || '').trim();

    // شكل الرسالة: بوت_REFCODE
    const match = body.match(/^بوت_([A-Za-z0-9_-]+)$/);
    if (!match) return;

    const refCode = match[1];
    const newJid  = m.sender;

    // سجل الإحالة
    const pts = await handleRef(conn, newJid, refCode, 'bot');

    if (pts) {
        // رسالة ترحيب لصاحب الرابط الجديد
        await conn.sendMessage(m.chat, {
            text:
                `*✅ أهلاً! تم تسجيل إحالتك*\n\n` +
                `صاحب الرابط اللي جيت منه اخد *${pts} نقطة* 🎉\n\n` +
                `لو عوز تلعب أنت كمان:\n*.تسجيل_تطوير*`
        }, { quoted: m });
    } else {
        // رسالة عادية لو الكود غلط أو متكرر
        await conn.sendMessage(m.chat, {
            text: `*👋 أهلاً بيك في إسكانور!*\n\n*.اوامر* لعرض الأوامر`
        }, { quoted: m });
    }
};

// بيشتغل في الخاص بس - يكشف كود الإحالة
handler.before = async (m, ctx, bot) => {
    if (m.isGroup) return false;
    const body = (m.body || m.text || '').trim();
    if (!body.match(/^بوت_([A-Za-z0-9_-]+)$/)) return false;

    // شيل الأمر من الـ body عشان يتعالج في handler فوق
    return false;
};

handler.command  = [];  // مش أمر عادي - بيتفعل من before hook
handler.usePrefix = false;
handler.category = 'dev';

// ══ رسالة ترحيب في الجروب - لما حد ينضم يتبعتله كلام عن الكود ══
export const onGroupJoin = async (conn, chat, newJid) => {
    try {
        await conn.sendMessage(newJid, {
            text:
                `*👋 أهلاً بيك في الجروب!*\n\n` +
                `لو انضممت عن طريق رابط حد، ابعتله نقاط:\n` +
                `اكتب في البوت: *.ref كوده*\n\n` +
                `مش عارف الكود؟ اسأل اللي بعتلك الرابط 😊`
        });
    } catch {}
};

export default handler;
