// أسماء المطورين وبياناتهم
const DEVS = {
    'اسكانور':  { name: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹',     jid: '201092178171' },
    'إسكانور':  { name: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹',     jid: '201092178171' },
    'escanor':  { name: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹',     jid: '201092178171' },
    'عفروتو':   { name: 'Afroto',        jid: '201140184231' },
    'افروتو':   { name: 'Afroto',        jid: '201140184231' },
    'afroto':   { name: 'Afroto',        jid: '201140184231' },
    'غوجو':     { name: '𝑮𝒐𝒋𝒐 𝑺𝒂𝒕𝒐𝒓𝒖', jid: '201286691232' },
    'جوجو':     { name: '𝑮𝒐𝒋𝒐 𝑺𝒂𝒕𝒐𝒓𝒖', jid: '201286691232' },
    'gojo':     { name: '𝑮𝒐𝒋𝒐 𝑺𝒂𝒕𝒐𝒓𝒖', jid: '201286691232' },
    'ريم':      { name: '-  𝑹𝐼𝑴  •',    jid: '963968077296' },
    'rim':      { name: '-  𝑹𝐼𝑴  •',    jid: '963968077296' },
};

let handler = async (m, { conn, bot, text, args, command }) => {
    // جيب الاسم من text أو من body مباشرة (احتياط للـ regex commands)
    let arg = (text || '').trim().toLowerCase();

    // لو text فاضي جرب تجيب من body مباشرة (لو الـ regex أخد الكلمة الأولى بس)
    if (!arg && m.body) {
        const body = m.body.trim();
        // اقطع الـ prefix + command ورجع الباقي
        const parts = body.split(/\s+/);
        if (parts.length > 1) {
            arg = parts.slice(1).join(' ').toLowerCase();
        }
    }

    let watermark;
    let num;

    if (arg) {
        const dev = DEVS[arg];
        if (!dev) {
            const list = [...new Set(Object.values(DEVS).map(d => d.name))].join('\n');
            return m.reply(`*❌ مطور غير معروف*\n\n*الأسماء المتاحة:*\n${list}\n\n*مثال:* .مطور إسكانور`);
        }
        watermark = dev.name;
        num = dev.jid;
    } else {
        // بدون اسم - يجيب كارت إسكانور (الأول في الـ owners)
        watermark = '𝑬𝑺𝑪𝑨𝑵𝑶𝑹';
        num = bot?.config?.owners?.[0]?.jid?.split('@')[0] || '201092178171';
    }

    const quoted = {
        key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
        message: { conversation: 'ESCANOR Bot👨🏻‍💻🔥' }
    };

    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${watermark}\nTEL;type=CELL;waid=${num}:+${num}\nEND:VCARD`;
    const img = 'https://i.postimg.cc/JntTcfnP/782d05642e3887d29ed37900aa767c6a.jpg';

    await conn.sendMessage(m.chat, {
        contacts: { displayName: watermark, contacts: [{ vcard }] },
        contextInfo: {
            forwardingScore: 2023,
            externalAdReply: {
                title: '𝑇𝛨𝛯 𝛩𝑊𝛮𝛯𝑅',
                body: watermark,
                sourceUrl: 'https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f',
                thumbnailUrl: img,
                mediaType: 1,
                showAdAttribution: true,
                renderLargerThumbnail: true
            }
        }
    }, { quoted });
};

handler.command = /^(owner|مطور|المطور)$/i;

export default handler;
