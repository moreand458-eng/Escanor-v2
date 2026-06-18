import { execSync } from "child_process";

export default {
    command: ["تنظيف"],
    category: "owner",
    usage: ["تنظيف"],
    owner: false,
    async execute(m, { bot }) {
        const isOwner = bot.config.owners.some(o => m.sender === o.jid || m.sender === o.lid);
        if (!isOwner) return m.reply('*❌ الأمر ده للمطورين فقط*');
        try {
            m.react("🧹");
            m.reply("*🧹╎ جاري التنظيف ...*");
            const result = execSync(
                'files=$(ls session/pre-key-* session/device-list-* 2>/dev/null | wc -l); rm -rf session/pre-key-* session/device-list-* 2>/dev/null; echo "$files"',
                { encoding: 'utf-8' }
            );
            const count = parseInt(result.trim()) || 0;
            m.react("🟢");
            await m.reply(`*🗑️╎ تم تنظيف [ ${count} ] ملف*`);
        } catch (error) {
            await m.reply(`\`\`\`${error.message}\`\`\``);
        }
    }
};
