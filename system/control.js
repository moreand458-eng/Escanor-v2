// ======================================================
// المطورين وبياناتهم - لازم تتطابق مع الـ owners في index.js
// ======================================================
const OWNERS_DATA = [
    { name: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹',     jid: '201092178171@s.whatsapp.net', displayName: '𝑬𝑺𝑪𝑨𝑵𝑶𝑹' },
    { name: '𝑮𝒐𝒋𝒐 𝑺𝒂𝒕𝒐𝒓𝒖', jid: '201286691232@s.whatsapp.net', displayName: 'Gojo Satoru' },
    { name: '-  𝑹𝐼𝑴  •',    jid: '963968077296@s.whatsapp.net', displayName: 'Rim' },
    { name: 'Afroto',        jid: '201140184231@s.whatsapp.net', displayName: 'Afroto' },
];

const getOwnerName = (jid) => {
    if (!jid) return null;
    const num = jid.split('@')[0].split(':')[0];
    const found = OWNERS_DATA.find(o =>
        o.jid.split('@')[0] === num || o.jid === jid
    );
    return found?.name || null;
};

// ======================================================
// رسائل الترحيب والوداع - مع دعم اسم المطور ديناميكياً
// ======================================================
const makeOwnerWelcome = (ownerName) => [
    `╭─┈─┈─┈─⟞👑⟝─┈─┈─┈─╮\n┃ *دخل المطور ${ownerName} ⚡*\n┃\n┃ يا كبير... النظام تحت أمرك 👁‍🗨\n┃ الجروب بقى في أمان 🕷️\n╰─┈─┈─┈─⟞⚡⟝─┈─┈─┈─╯`,
    `*🔥 المطور نزل على الجروب*\n\nاستعدوا... ${ownerName} هنا 👑⚡`,
    `*⚡ تحذير - دخول المطور*\n\n${ownerName} دخل الجروب 🕷️`,
];

const makeOwnerBye = (ownerName) => [
    `*👑 المطور ${ownerName} غادر الجروب*\n\n> النظام في وضع الحراسة الذاتية 🕷️`,
    `*⚡ المطور خرج*\n\n${ownerName} قرر يمشي... من يجرؤ الآن؟ ☠️`,
];

// رسالة البوت لما المطور يكتب "بوت"
const makeBotReply = (ownerName) =>
    `╭─┈─┈─┈─⟞👑⟝─┈─┈─┈─╮\n┃ *أهلاً ${ownerName} 🔥*\n┃ البوت شغال وجاهز 🕷️\n╰─┈─┈─┈─⟞⚡⟝─┈─┈─┈─╯`;

const SUPPORT_TEAM = [
    { name: 'Afroto', url: 'https://wa.me/201140184231' },
    { name: 'Dev 2',  url: 'https://wa.me/201227470860' }
];

// ======================================================
// group - أحداث المجموعات
// ======================================================
const group = async (ctx, event, eventType) => {
    try {
        if (!event?.participants) return null;

        const participants = event.participants.filter(p => p?.phoneNumber).map(p => p.phoneNumber);
        const author = event.author;

        const users = participants.length
            ? participants.map(p => '@' + p.split('@')[0]).join(' and ')
            : 'No users';
        const authorTag = author ? '@' + author.split('@')[0] : 'Unknown';

        const messages = {
            add:     `*مـنــور/ه  يـخــويـا/يجمده الــبـار🥸* ${users}${authorTag === users ? '' : `\n𝐛𝐲 ${authorTag}`}`,
            remove:  `${users} غـادر كـلـب يـجـي مـحـتـرم🐤 ..... الـخـرابـة${authorTag === users ? '' : `\n𝐛𝐲 ${authorTag}`}`,
            promote: `♡゙ مـبـروك الادمـن ${users}\nby ${authorTag}`,
            demote:  `♡゙ بـقـيـت عـضـو خـلاص ${users}\nby ${authorTag}`
        };

        const txt = messages[eventType];
        if (!txt) return null;

        const disabled = global._gs?.[event.chat]?.welcomeDisabled;
        if (disabled) return 9999;

        // لو المطور اللي دخل أو خرج
        if (['add', 'remove'].includes(eventType) && participants.length) {
            const owners = ctx.config?.owners || [];
            const isOwnerAffected = participants.some(p =>
                owners.some(o => p === o.jid || p === o.lid)
            );

            if (isOwnerAffected) {
                // جيب اسم المطور من الـ participants
                const ownerParticipant = participants.find(p =>
                    owners.some(o => p === o.jid || p === o.lid)
                );
                const ownerEntry = owners.find(o =>
                    ownerParticipant === o.jid || ownerParticipant === o.lid
                );
                const ownerName = ownerEntry?.name || getOwnerName(ownerParticipant) || '𝑬𝑺𝑪𝑨𝑵𝑶𝑹';

                const msgs = eventType === 'add' ? makeOwnerWelcome(ownerName) : makeOwnerBye(ownerName);
                const msg = msgs[Math.floor(Math.random() * msgs.length)];
                await new Promise(r => setTimeout(r, 3000));
                await ctx.sock.sendMessage(event.chat, { text: msg, mentions: participants });
                return null;
            }
        }

        const img = ['remove', 'add'].includes(eventType)
            ? (event.userUrl || 'https://i.postimg.cc/RFqPQkhZ/8653766a329a5a5a714e221e9aa67e3a.jpg')
            : 'https://i.postimg.cc/xd6xmf0p/9e0c32d018f9bea5a756fffa76e95b3a.jpg';

        const mentions = author ? [author, ...participants] : participants;

        await new Promise(r => setTimeout(r, 3000));

        await ctx.sock.msgUrl(event.chat, txt, {
            img,
            title: ctx.config?.info?.nameBot || 'ESCANOR BOT',
            body: '𝐴 𝑠𝑖𝑚𝑝𝑙𝑒 𝑊ℎ𝑎𝑡𝑠𝐴𝑝𝑝 𝑏𝑜𝑡 𝑓𝑜𝑟 𝑏𝑒𝑔𝑖𝑛𝑛𝑒𝑟𝑠, 𝑏𝑦 𝐸𝑆𝐶𝐴𝑁𝑂𝑅',
            mentions,
            newsletter: { name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐋 🕷️', jid: '120363422581600030@newsletter' },
            big: ['remove', 'add'].includes(eventType)
        });

    } catch (e) { console.error('[group event]', e.message); }
    return null;
};

// ======================================================
// access - رسائل التحقق من الصلاحيات
// (بيتشغل قبل كل أمر - هنا بنضيف check الـ toggle)
// ======================================================
const access = async (msg, checkType, time) => {
    const conn = await msg.client();

    // === Check للـ toggle system ===
    // لو checkType مش موجود معناه البوت بيحاول يشغل أمر عادي
    // نشوف لو الأمر أو قسمه موقف
    if (!checkType && !msg.isOwner) {
        const sys = global._gs?.__system;
        if (sys && (sys.disabledCommands?.length || sys.disabledCategories?.length)) {
            const body = (msg.body || msg.text || '').trim();
            // نجيب الـ command من body
            const { command: msgCmd, category: msgCat } = _extractMsgCmd(body, msg._bot || conn);

            if (msgCmd && sys.disabledCommands?.includes(msgCmd)) {
                await conn?.sendMessage(msg.chat, {
                    text: '*「💥」 الامـر دا إسـكانـور مـطـوري مـوقـفـو*'
                });
                return false;
            }

            if (msgCat && sys.disabledCategories?.includes(msgCat)) {
                await conn?.sendMessage(msg.chat, {
                    text: '*「💥」 الـقـسـم دا إسـكانـور مـطـوري مـوقـفـو*'
                });
                return false;
            }
        }
    }

    const quoted = {
        key: {
            participant: `${msg.sender.split('@')[0]}@s.whatsapp.net`,
            remoteJid: 'status@broadcast',
            fromMe: false,
        },
        message: {
            contactMessage: {
                displayName: `${msg.pushName}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:${msg.pushName}\nitem1.TEL;waid=${msg.sender.split('@')[0]}:${msg.sender.split('@')[0]}\nEND:VCARD`,
            },
        },
        participant: '0@s.whatsapp.net',
    };

    const messages = {
        cooldown: `*♡⏳ استنى ${time ? Math.ceil(time / 1000) : 'بعض كام'} ثانية*`,
        owner:    `*「🔥」الامـر دا بـتـاع إسـكانـور مـطـوري.*`,
        group:    `*♡ الأمر ده في الجروبات بس ♡*`,
        admin:    `*「🔥」 الامـر دا بـتـاع الادمـن بـس يـسـطـا*`,
        private:  `*「💥」 الامـر دا فـي الـخـاص بـس يـسـطـا*`,
        botAdmin: `*「💥」 ارفـعـني مـشـرف يـسـطـا وبـعـدين نـفـز الامـر*`,
        noSub:    `*♡ الأمر ده في البوت الأساسي فقط ♡*`,
        disabled: `*「💥」 الامـر دا إسـكانـور مـطـوري مـوقـفـو*`,
        error:    `*♡ الأمر فيه خطأ، تواصل مع فريق الدعم 🛡️ ♡*`
    };

    if (conn && messages[checkType]) {
        try {
            if (checkType === 'error') {
                await conn.sendButton(msg.chat, {
                    imageUrl: 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg',
                    bodyText: messages[checkType],
                    footerText: '𝐄𝐒𝐂𝐀𝐍𝛩𝐑 Support Team',
                    buttons: SUPPORT_TEAM.map(s => ({
                        name: 'cta_url',
                        params: { display_text: `🛡️ ${s.name}`, url: s.url }
                    })),
                    mentions: [msg.sender],
                    newsletter: { name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐋 🕷️', jid: '120363422581600030@newsletter' },
                    interactiveConfig: { buttons_limits: 2 }
                }, quoted);
            } else {
                await conn.msgUrl(msg.chat, messages[checkType], {
                    img: 'https://i.postimg.cc/HxjS4qx2/aa58a61ac0b2d8c8d768ff8b86edd273.jpg',
                    title: '𝐀𝐥𝐞𝐫𝐭𝐬 | 𝐖𝐚𝐫𝐧𝐢𝐧𝐠𝐬',
                    body: '𝐵𝑜𝑡 𝑎𝑙𝑒𝑟𝑡𝑠',
                    newsletter: { name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐋 🕷️', jid: '120363422581600030@newsletter' },
                    big: false
                }, quoted);
            }
        } catch {
            await conn.sendMessage(msg.chat, { text: messages[checkType] });
        }
        return false;
    }
    return null;
};

// helper - استخراج command + category من body
let __cmdMap = null;
let __cmdMapAt = 0;
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const _buildMap = (base) => {
    const now = Date.now();
    if (__cmdMap && now - __cmdMapAt < 60_000) return __cmdMap;
    const map = {};
    const walk = (dir) => {
        if (!fs.existsSync(dir)) return;
        for (const item of fs.readdirSync(dir)) {
            const p = path.join(dir, item);
            try {
                const st = fs.statSync(p);
                if (st.isDirectory()) { walk(p); continue; }
                if (!item.endsWith('.js')) continue;
                const content = fs.readFileSync(p, 'utf8');
                const catM = content.match(/\.category\s*=\s*['"]([^'"]+)['"]/);
                const cat = catM?.[1] || path.basename(path.dirname(p));
                const arr = content.match(/\.command\s*=\s*\[([^\]]*)\]/);
                if (arr) arr[1].split(',').forEach(s => {
                    const v = s.trim().replace(/^['"]|['"]$/g, '');
                    if (v) map[v.toLowerCase()] = cat;
                });
                const single = content.match(/\.command\s*=\s*['"]([^'"]+)['"]/);
                if (single) map[single[1].toLowerCase()] = cat;
            } catch {}
        }
    };
    walk(base);
    __cmdMap = map;
    __cmdMapAt = now;
    return map;
};

const _extractMsgCmd = (body, connOrBot) => {
    if (!body) return { command: null, category: null };
    const prefixes = connOrBot?.config?.prefix || ['.', '/', '!'];
    const pfxArr = Array.isArray(prefixes) ? prefixes : [prefixes];
    for (const p of pfxArr) {
        if (body.startsWith(p)) {
            const cmd = body.slice(p.length).split(/\s+/)[0]?.toLowerCase() || null;
            const base = connOrBot?.config?.commandsPath || './plugins';
            const map = _buildMap(base);
            return { command: cmd, category: cmd ? map[cmd] : null };
        }
    }
    return { command: null, category: null };
};

export { access, group, makeBotReply, getOwnerName };
