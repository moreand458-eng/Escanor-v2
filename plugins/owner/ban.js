import fs from 'fs';
import path from 'path';

const ff = async (m, { conn, text, command }) => {
    let target = m.mentionedJid?.[0] || m.quoted?.sender;
    
    if (!target && text?.includes('@')) {
        target = text.replace('@', '') + '@s.whatsapp.net';
    }
    
    if (!target) {
        return m.reply(`*~ 💙 منشن شخص مثل /${command} @${m.sender.split('@')[0]} ❤️ ~*`);
    }
    
    const jid = await m.lid2jid(target);
    const user = global.db.users[jid] || {};
    
    const isUnban = command === "فك_حظر" || command === "الغاء_الحظر";
    
    if (isUnban) {
        if (user.banned) {
            delete user.banned;
            await conn.sendMessage(m.chat, { 
                text: `*✅ ~تم فك حظر @${target.split('@')[0]}*\n> *_دلوقت يقدر يكلم البوت عادي_*`, 
                mentions: [target] 
            });
        } else {
            m.reply(`*❌ ~هذا المستخدم ليس محظوراً*`);
        }
        return;
    }
    
    user.banned = true;
    await conn.sendMessage(m.chat, { 
        text: `*✅ ~تم حظر @${target.split('@')[0]}*\n> *_مش هيعرف يكلم البوت تاني_*`, 
        mentions: [target] 
    });
};

ff.usage = ["حظر", "فك_حظر"];
ff.category = "owner";
ff.command = ["حظر", "فك_حظر", "الغاء_الحظر"];
ff.owner = true;

export default ff;