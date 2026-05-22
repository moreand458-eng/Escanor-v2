import { Client } from 'esewsub';
import { group, access } from "./system/control.js";
import UltraDB from "./system/UltraDB.js";
import sub from './sub.js';

/* =========== Client ========== */
const client = new Client({
  phoneNumber: '584265306799', // Bot number
  prefix: [".", "/", "!"],
  fromMe: false, 
  owners: [
  // Owner 1
    { name: "𝑬𝑺𝑪𝑨𝑵𝑶𝑹", lid: "275561477836913@lid", jid: "201092178171@s.whatsapp.net" },
  // Owner 2
    { name: "𝑬𝑠ᥴ𝑎ꪀ𝑜𝑟", lid: "221307316789354@lid", jid: "584167505128@s.whatsapp.net" },
  // Owner 3
    { name: "𝑮𝒐𝒋𝒐 𝑺𝒂𝒕𝒐𝒓𝒖", jid: "201286691232@s.whatsapp.net", lid: "" },
  // Owner 4 
   { name: "𝑫𝒖𝒍𝒂𝒄𝒆𝒄𝒂", jid: "201094212216@s.whatsapp.net", lid: "" }
  ],
  settings: { noWelcome: true },
  commandsPath: './plugins'
});

client.onGroupEvent(group);
client.onCommandAccess(access);

/* =========== Database ========== */
if (!global.db) {
    global.db = new UltraDB();
}

/* =========== Config ========== */
const { config } = client;
config.info = { 
  nameBot: "♡ 𝑬𝑺𝑪𝑨𝑵𝑶𝑹 𝑩𝑶𝑻👨🏻‍💻 〈", 
  nameChannel: "𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️", 
  idChannel: "120363422581600030@newsletter",
  urls: {
    repo: "https://github.com/moreand458-eng/Escanor-bot",
    api: "https://emam-api.web.id",
    channel: "https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f"
  },
  copyright: { 
    pack: 'سـ ES إ', 
    author: 'ES'
  },
  images: [
    "https://i.postimg.cc/jqm1vSy9/1779217311694.png",
    "https://i.postimg.cc/PxcS6SvT/d7e8080a5326b0d93e36d85d4a897f8d.jpg",
    "https://i.postimg.cc/nzMdYyrt/ad97fb316f5da69714a7f521673217ac.jpg"
  ]
};

/* =========== Start ========== */
client.start();

setTimeout(async () => {
if (client.commandSystem) { 
sub(client)
  }
}, 2000);


/* =========== Catch Errors ========== */
process.on('uncaughtException', (e) => {
    if (e.message.includes('rate-overlimit')) {}
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
});


/* 
=========== Memory Monitor ========== 

setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024
    if (used > 800) {
        console.log(`🔄 Bot memory full (${used.toFixed(1)}MB), restarting...`)
        process.exit(1) 
    }
}, 300_000) 

*/