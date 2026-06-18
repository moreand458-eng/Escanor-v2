const NASHAEED = [
    { title: 'طلع البدر علينا', artist: 'تراث إسلامي', url: 'https://ia803403.us.archive.org/17/items/tala3-albadro-alayna/tala3-albadro-alayna.mp3' },
    { title: 'أنشودة يا إلهي', artist: 'إسلامية', url: '' },
];
const handler = async (m, { conn }) => {
    const n = NASHAEED[Math.floor(Math.random() * NASHAEED.length)];
    if (n.url) {
        try {
            await conn.sendMessage(m.chat, {
                audio: { url: n.url },
                mimetype: 'audio/mpeg',
                fileName: `${n.title}.mp3`
            }, { quoted: m });
            return;
        } catch {}
    }
    await conn.sendMessage(m.chat, {
        text: `🎵 *${n.title}*\n> ${n.artist}\n\n_يمكنك البحث عنها على اليوتيوب_`
    }, { quoted: m });
};
handler.command  = ['انشوده', 'أنشودة'];
handler.usage    = ['انشوده'];
handler.category = 'religion';
export default handler;
