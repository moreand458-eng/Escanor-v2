// content_control.js - نظام مركزي للتحكم في المحتوى المحذوف
// كل مكان في البوت بيمسح رسالة (كتم، حظر، anti-link، anti-spam...) يفضل يمر من هنا
// عشان نقدر نطلع إحصائيات حقيقية (مين انحذفله رسائل، قد ايه، ليه) من مكان واحد

import { numOf } from './admin_utils.js';

const MAX_LOG = 300; // أقصى عدد رسائل نحتفظ بسجلها (عشان ملف settings.json ما يكبرش أوي)

// ===== تخزين عالمي (مش مرتبط بجروب معين) - بيتحفظ تلقائي مع global._gs =====
export const getGlobalStore = () => {
    if (!global._gs) global._gs = {};
    if (!global._gs.__global) global._gs.__global = {};
    const gg = global._gs.__global;
    if (!gg.bannedGlobal)  gg.bannedGlobal  = [];
    if (!gg.mutedGlobal)   gg.mutedGlobal   = [];
    if (!gg.deletedLog)    gg.deletedLog    = [];
    if (!gg.deletedCounts) gg.deletedCounts = {};
    return gg;
};

// ===== استخراج نص الرسالة من أي نوع =====
const extractText = (m) => {
    const t =
        m.text || m.body ||
        m.message?.conversation ||
        m.message?.extendedTextMessage?.text ||
        m.message?.imageMessage?.caption ||
        m.message?.videoMessage?.caption ||
        m.message?.documentMessage?.caption ||
        '';
    if (t) return t;
    // مفيش نص؟ يبقى وسائط
    if (m.message?.imageMessage)    return '📷 [صورة]';
    if (m.message?.videoMessage)    return '🎥 [فيديو]';
    if (m.message?.audioMessage)    return '🎤 [صوت]';
    if (m.message?.stickerMessage)  return '🎭 [ستيكر]';
    if (m.message?.documentMessage) return '📄 [ملف]';
    return '(بدون نص)';
};

/**
 * يمسح الرسالة + يسجلها في السجل المركزي + (اختياري) يبعت إشعار في الجروب
 * @param {object} m - رسالة الـ engine
 * @param {object} conn - الاتصال
 * @param {string} reason - سبب الحذف (نص عربي قصير)
 * @param {object} opts - { silent: true } لو مش عايز إشعار في الجروب (بس يتسجل في الإحصائيات)
 */
export const logAndDeleteMessage = async (m, conn, reason = 'مخالفة قوانين الجروب', opts = {}) => {
    const gg = getGlobalStore();
    const text = extractText(m).slice(0, 400);
    const name = m.pushName || numOf(m.sender);

    try { await conn.sendMessage(m.chat, { delete: m.key }); } catch {}

    gg.deletedLog.unshift({
        time: Date.now(),
        chat: m.chat,
        sender: m.sender,
        name,
        reason,
        text
    });
    if (gg.deletedLog.length > MAX_LOG) gg.deletedLog.length = MAX_LOG;
    gg.deletedCounts[m.sender] = (gg.deletedCounts[m.sender] || 0) + 1;

    if (opts.silent) return;

    try {
        await conn.sendMessage(m.chat, {
            text:
                `🗑️ *تم حذف رساله للمستخدم* @${numOf(m.sender)} *(${name})*\n` +
                `📌 *السبب:* ${reason}\n` +
                `💬 *محتوي الرساله:*\n${text}`,
            mentions: [m.sender]
        });
    } catch {}
};

// ===== عداد الرسائل المحذوفة لمستخدم معين =====
export const getDeletedCount = (sender) => {
    const gg = getGlobalStore();
    return gg.deletedCounts[sender] || 0;
};

// ===== آخر X رسائل محذوفة (لجروب معين أو عالميًا) =====
export const getRecentDeletions = (chat = null, limit = 10) => {
    const gg = getGlobalStore();
    const list = chat ? gg.deletedLog.filter(d => d.chat === chat) : gg.deletedLog;
    return list.slice(0, limit);
};
