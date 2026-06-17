import { Client } from 'esewsub';
import autoJoinChannel from './libs/auto-join-channel.js';
import BotDetector from './libs/bot-detector.js';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import keepServerAlive from './system/keep_alive.js';
import sub from './sub.js';

/* =========== منع إيقاف السيرفر نهائياً ========== */
// بيمسك كل الإشارات اللي بتوقف البوت
process.removeAllListeners('SIGINT');
process.removeAllListeners('SIGTERM');
process.removeAllListeners('SIGHUP');
process.removeAllListeners('exit');

process.on('SIGINT',  () => console.log('🛡️ SIGINT blocked'));
process.on('SIGTERM', () => console.log('🛡️ SIGTERM blocked'));
process.on('SIGHUP',  () => console.log('🛡️ SIGHUP blocked'));

/* =========== Database ========== */
if (!global.db) global.db = new UltraDB();

/* =========== Client ========== */
const client = new Client({
    phoneNumber: '201505741613',
    prefix: ['.', '/', '!'],
    fromMe: false,
    owners: [
        { name: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹',    lid: '275561477836913@lid', jid: '201092178171@s.whatsapp.net' },
        { name: '𝑬𝒔ᥴ𝒂ꪀ𝒐𝒓',      lid: '221307316789354@lid', jid: '584167505128@s.whatsapp.net' },
        { name: '𝑮𝒐𝒋𝒐 𝑺𝒂𝒕𝒐𝒓𝒖', lid: '',                    jid: '201286691232@s.whatsapp.net' },
        { name: '𝑫𝒖𝒍𝒂𝒄𝒆𝒄𝒂',     lid: '',                    jid: '201094212216@s.whatsapp.net' },
        { name: '-  𝑹𝐼𝑴  •',    lid: '92415666974724@lid',  jid: '963968077296@s.whatsapp.net' }
    ],
    settings: {},
    commandsPath: './plugins',
    autoReconnect:        true,
    reconnectDelay:       3000,
    maxReconnectAttempts: 999999,
});

/* =========== حمل المطورين + شيل secondary ========== */
try {
    const extra = global.db?.data?.extraOwners || [];
    if (extra.length) {
        const cleaned = extra.map(({ secondary, ...rest }) => rest);
        client.config.owners.push(...cleaned);
    }
} catch {}

try {
    client.config.owners = client.config.owners.map(({ secondary, ...rest }) => rest);
} catch {}

client.onGroupEvent(group);
client.onCommandAccess(access);

/* =========== Config ========== */
client.config.info = {
    nameBot:     '♡ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻👨🏻‍💻 〈',
    nameChannel: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐋 🕷️',
    idChannel:   '120363422581600030@newsletter',
    urls: {
        repo:    'https://github.com/moreand458-eng/Escanor-bot',
        api:     'https://emam-api.web.id',
        channel: 'https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f'
    },
    copyright: { pack: 'سـ ES إ', author: 'ES' },
    images: [
        'https://i.postimg.cc/jqm1vSy9/1779217311694.png',
        'https://i.postimg.cc/PxcS6SvT/d7e8080a5326b0d93e36d85d4a897f8d.jpg',
        'https://i.postimg.cc/nzMdYyrt/ad97fb316f5da69714a7f521673217ac.jpg'
    ]
};

/* =========== Pairing Code Notification ========== */
// يبعت الـ pairing code كـ SMS أو WhatsApp message للمطور
const OWNER_PHONE = '201092178171'; // رقم المطور يستقبل الكود

const sendPairingNotification = async (code) => {
    // محاولة إرسال SMS عبر API مجاني
    const apis = [
        `https://api.callmebot.com/whatsapp.php?phone=${OWNER_PHONE}&text=ESCANOR+PAIRING+CODE:+${code}&apikey=`,
    ];

    // بعت الكود في console بشكل واضح
    console.log('\n' + '='.repeat(50));
    console.log(`🔑 PAIRING CODE: ${code}`);
    console.log(`📱 FOR NUMBER: 201505741613`);
    console.log('='.repeat(50) + '\n');

    // لو في sock متصل ابعت لنفسك
    try {
        if (client.sock?.user) {
            const ownerJid = OWNER_PHONE + '@s.whatsapp.net';
            await client.sock.sendMessage(ownerJid, {
                text: `🔑 *ESCANOR BOT - Pairing Code*\n\n\`${code}\`\n\n📱 للرقم: 201505741613\n\nادخل الكود ده في WhatsApp`
            });
        }
    } catch {}
};

// مراقبة الـ pairing code
const checkPairingCode = setInterval(async () => {
    try {
        const sock = client.sock;
        if (!sock) return;

        // hook على connection.update
        sock.ev?.on?.('connection.update', async (update) => {
            if (update?.qr || update?.pairingCode) {
                const code = update.pairingCode || update.qr;
                if (code && code.length > 3) {
                    clearInterval(checkPairingCode);
                    await sendPairingNotification(code);
                }
            }
        });
        clearInterval(checkPairingCode);
    } catch {}
}, 1000);

/* =========== Start ========== */
client.start();
setTimeout(() => { try { if (client.commandSystem) sub(client); } catch {} }, 3000);

/* =========== منع النوم/التعليق/التوقف 🛡️ ========== */
keepServerAlive(client, {
    connection: { checkEveryMs: 15000, maxDisconnectedMs: 90000 },
    memory:     { checkEveryMs: 60000, maxHeapMB: 700 },
    ping:       { everyMs: 240000 },
});

/* =========== المكتبات ========== */
setTimeout(() => autoJoinChannel(client), 5000);

setTimeout(() => {
    try {
        const botDetector = new BotDetector(client, {
            ownerJid:     '201092178171@s.whatsapp.net',
            autoWarn:     true,
            autoKick:     false,
            antiBotMode:  false,
            sessionPaths: ['./sessions', './auth_info'],
        });
        botDetector.start();
        global._botDetector = botDetector;
    } catch {}
}, 5000);

/* =========== Error Handlers ========== */
const IGNORE = [
    'rate-overlimit', 'Connection Closed', 'timed out',
    'ECONNRESET', 'ENOTFOUND', 'fetch failed',
    'Socket connection timeout', 'stream errored',
    'Unexpected server response', 'invalid session'
];

process.on('uncaughtException', (e) => {
    if (IGNORE.some(x => e?.message?.includes(x))) return;
    console.error('[uncaughtException]', e?.message);
});

process.on('unhandledRejection', (e) => {
    if (IGNORE.some(x => e?.message?.includes(x))) return;
    console.error('[unhandledRejection]', e?.message);
});

/* =========== منع process.exit ========== */
const _exit = process.exit.bind(process);
process.exit = (code) => {
    console.log(`🛡️ process.exit(${code}) blocked - server stays alive`);
    // مش بنعمل exit
};
