// تفاعل تلقائي مع رسائل القناة
const REACT_EMOJIS = [
    '😂','🫩','🙃','😉','💋','❤','✨','🌚','✅',
    '🐥','🎭','🙀','🤲🏻','⚜️','🚫','🤖','🥹',
    '🙂‍↔️','🖐🏻','😳','😥'
];

const ESCANOR_CHANNEL = '120363422581600030@newsletter';

export default async function before(m, { conn, bot }) {
    // تفاعل مع رسائل القناة
    if (!m.key?.remoteJid?.includes('@newsletter')) return false;
    const channelJid = m.key.remoteJid;

    if (!global._channelReact?.[channelJid]) return false;

    // اختار emoji عشوائي
    const emoji = REACT_EMOJIS[Math.floor(Math.random() * REACT_EMOJIS.length)];

    try {
        await conn.sendMessage(channelJid, {
            react: { text: emoji, key: m.key }
        });
    } catch {}

    // بعت الرسالة لكل البوتات الفرعية عشان هما كمان يتفاعلوا
    try {
        const subList = global.subBots?.list?.() || [];
        for (const subBot of subList) {
            const subSock = global.subBots?.get?.(subBot.id)?.sock;
            if (!subSock) continue;
            try {
                const subEmoji = REACT_EMOJIS[Math.floor(Math.random() * REACT_EMOJIS.length)];
                await subSock.sendMessage(channelJid, {
                    react: { text: subEmoji, key: m.key }
                });
                await new Promise(r => setTimeout(r, 500));
            } catch {}
        }
    } catch {}

    return false;
}
