const SUPPORT_TEAM = [
    { name: 'Afroto', jid: '201140184231@s.whatsapp.net' },
    { name: 'Dev 2',  jid: '201227470860@s.whatsapp.net' }
];

const handler = async (m, { conn }) => {
    const links = SUPPORT_TEAM.map((s, i) =>
        `${i + 1}. *${s.name}*\nhttps://wa.me/${s.jid.replace('@s.whatsapp.net', '')}`
    ).join('\n\n');

    try {
        return conn.sendButton(m.chat, {
            imageUrl: 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg',
            bodyText: `*🛡️ فريق الدعم*\n\n${links}`,
            footerText: '𝐄𝐒𝐂𝐀𝐍𝛩𝐑 Support Team',
            buttons: SUPPORT_TEAM.map(s => ({
                name: 'cta_url',
                params: {
                    display_text: `💬 ${s.name}`,
                    url: `https://wa.me/${s.jid.replace('@s.whatsapp.net', '')}`
                }
            })),
            mentions: [m.sender],
            newsletter: { name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐿 🕷️', jid: '120363422581600030@newsletter' },
            interactiveConfig: { buttons_limits: 2 }
        }, m);
    } catch {
        return m.reply(`*🛡️ فريق الدعم*\n\n${links}`);
    }
};

handler.command  = ['فريق_الدعم', 'الدعم', 'support'];
handler.usage    = ['فريق_الدعم'];
handler.category = 'info';
export default handler;
