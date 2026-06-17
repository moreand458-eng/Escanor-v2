/**
 * 📢 مكتبة الانضمام للقناة - اختياري فقط
 * تم تعديلها: لا يتم الانضمام تلقائياً بدون إذن المستخدم
 */

const CHANNEL_JID = '120363422581600030@newsletter';

const autoJoinChannel = async (client, channelJid = CHANNEL_JID) => {
    // ✅ لا انضمام تلقائي - فقط لو المستخدم طلب صراحةً
    console.log(`[AutoJoin] الانضمام التلقائي للقناة معطل (ToS compliance)`);
    return false;
};

export default autoJoinChannel;
