// يحل مشكلة "البوت بينسى إنه أدمن":
// الفريموورك بيحدد m.isBotAdmin/m.isAdmin من groupMetadata مخزّنة وقت آخر تحديث،
// فلو حصل تغيير حديث (ترقية/تنزيل، أو فيه أكتر من بوت رئيسي/فرعي في نفس الجروب)
// القيمة بتفضل قديمة وممكن تكون غلط.
// هنا بنحدّثها live قبل تنفيذ أي أمر، عشان:
//  - كل بوت (رئيسي أو فرعي) يفحص هو نفسه لو هو فعلاً أدمن في الجروب ده
//  - لو البوت ده أدمن فعلي → ينفذ أوامر الأدمن عادي
//  - لو مش أدمن (ولا أي بوت تاني أدمن) → الفريموورك هيرفض ويبعت "ارفعني ادمن"
//    (عبر handler.botAdmin = true في كل أمر إداري)
import { isBotActualAdmin, isUserActualAdmin } from '../../system/bot_protection.js';

export default async function before(m, { conn }) {
    if (!m.isGroup) return false;

    try {
        const [liveBotAdmin, liveUserAdmin] = await Promise.all([
            isBotActualAdmin(m.chat, conn),
            isUserActualAdmin(m.sender, m.chat, conn),
        ]);

        // نثق بالفحص اللحظي بالكامل (true أو false) لأنه بيجيب أحدث بيانات من واتساب
        // مش بس لو true، عشان نلحق حالة "كان أدمن وبقى مش أدمن" برضو
        m.isBotAdmin = liveBotAdmin;
        if (liveUserAdmin) m.isAdmin = true; // مايقلّلش صلاحية لو الفريموورك أكدها بطريقة تانية (super/lid)
    } catch {
        // فشل الفحص (مشكلة شبكة مؤقتة) - سيب القيم الجايه من الفريموورك زي ما هي
    }

    return false;
}
