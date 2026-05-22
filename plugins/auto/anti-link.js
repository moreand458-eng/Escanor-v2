export default async function before(m, { conn }) {
    const g = global.db?.groups[m.chat];

    if (g?.antiLink && !m.isOwner && !m.isAdmin) {
        const groupLinkRegex = /(https?:\/\/)?(chat\.whatsapp\.com|whatsapp\.com\/channel)\/[A-Za-z0-9]+/gi;

        if (groupLinkRegex.test(m.text)) {

            await conn.sendMessage(m.chat, {
                delete: m.key
            });

            await conn.sendMessage(m.chat, { 
                text: `🚫 *تم حذف الرابط*\n\n@${m.sender.split('@')[0]} ممنوع نشر روابط الجروبات أو القنوات\n\n> يرجى الالتزام بقوانين المجموعة`,
                mentions: [m.sender]
            });

            return true;
        }
    }

    return false;
}