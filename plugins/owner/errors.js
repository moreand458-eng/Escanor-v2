const run = async (m, { bot, conn }) => {
    // bot.errors ممكن تكون function أو array أو undefined
    let errors = [];
    
    try {
        if (typeof bot.errors === 'function') {
            errors = bot.errors() || [];
        } else if (Array.isArray(bot.errors)) {
            errors = bot.errors;
        } else if (global._botErrors) {
            errors = global._botErrors;
        }
    } catch {}

    if (!errors.length) {
        return m.reply('✅ لا يوجد أي أخطاء مسجلة حتى الآن');
    }

    const res = errors.map(x =>
        `\n\n#📂 الملف: ${x.file || 'غير معروف'}\n#🌱 الأمر: ${x.command || 'غير معروف'}\n#❌ الايرور: ${x.error || x.message || x}\n==============`
    ).join('');

    m.reply(res);
};

run.command = ['الايرورات'];
run.usage = ['الايرورات'];
run.category = 'owner';
run.owner = true;
export default run;
