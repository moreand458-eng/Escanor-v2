// نظام القوانين
const getG = (chatId) => {
    if (!global._gs) global._gs = {};
    if (!global._gs[chatId]) global._gs[chatId] = {};
    return global._gs[chatId];
};

const handler = async (m, { conn, command, text }) => {
    const g = getG(m.chat);

    if (command === 'setrules' || command === 'قوانين_تعيين') {
        if (!text) return m.reply('*مثال:* .setrules 1. لا شتم\n2. لا روابط');
        g.rules = text.trim();
        return m.reply('✅ *تم تعيين قوانين الجروب*');
    }

    if (command === 'rules' || command === 'قوانين') {
        if (!g.rules) return m.reply('*❌ لم يتم تعيين قوانين بعد*\nاستخدم: .setrules');
        return conn.sendMessage(m.chat, {
            text:
                `╭─┈─┈─┈─⟞📜⟝─┈─┈─┈─╮\n` +
                `┃ *قوانين الجروب*\n` +
                `╰─┈─┈─┈─⟞📜⟝─┈─┈─┈─╯\n\n` +
                `${g.rules}\n\n` +
                `> _من يخالف القوانين يتم التعامل معه وفق لوائح الجروب_`
        }, { quoted: m });
    }
};

handler.command  = ['setrules', 'rules', 'قوانين', 'قوانين_تعيين'];
handler.usage    = ['setrules', 'rules'];
handler.admin    = true;
handler.category = 'protection';
export default handler;
