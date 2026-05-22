export default {
  command: ["$"],
  description: "...",
  category: "owner",
  usage: ["$"],
  owner: true,
  usePrefix: false,
  async execute(m, { text }) {
    
        if (!text) return reply('exe npm i axios');
        try {
            m.react("⚡")
            const { execSync } = await import('child_process');
            const result = execSync(text, { encoding: 'utf-8' });
            m.react("🟢")
            await m.reply(result);
        } catch (error) {
            await m.reply(`\`\`\`${error.message}\`\`\``);
        }
  }
}