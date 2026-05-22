import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { uploadToCatbox } from "../../system/utils.js";

let handler = async (m, { conn, bot, text }) => {
  try {
    if (!m.quoted?.mimetype) return m.reply("*❌ ~ رد علي الصوره اولاً ~*");
    if (!m.quoted.mimetype.startsWith('image/')) return m.reply("*❌ ~ ده مش ملف صوره ~*");
    if (!text) return m.reply("*💬 ~ اكتب التعديل المطلوب ~*");
    
    m.react("⚡");
    
    const buffer = await m.quoted.download();
    const imageUrl = await uploadToCatbox(buffer);
    
    const editRes = await bot.Api.tools.editImage({ 
      imageUrl: imageUrl, 
      prompt: text 
    });
    
    if (!editRes?.status || !editRes?.recordId) {
      return m.reply("*❌ ~ فشل في بدء عملية التعديل ~*");
    }
    
    const waitMsg = await m.reply("*🎨 ~ جاري تعديل الصورة... قد يستغرق هذا دقيقة ~*");
    
    let result = null;
    for (let j = 0; j < 30; j++) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      const checkRes = await bot.Api.tools.checkResult({ rid: editRes.recordId });
      if (checkRes?.completed && checkRes?.resultUrl) {
        result = checkRes.resultUrl;
        break;
      }
    }
   
    if (!result) return m.reply("*❌ ~ لم يتم الانتهاء من التعديل في الوقت المحدد ~*");
    
    await conn.sendMessage(m.chat, {
      image: { url: result },
      caption: `✅ ~ تم التعديل بنجاح\n- *(${text})*`,
    }, { quoted: m });
    
  } catch (error) {
    console.error(error);
    return m.reply("*❌ ~ حدث خطأ أثناء تعديل الصورة ~*");
  }
};

handler.usage = ["تعديل"];
handler.command = ["editimage", "تعديل"];
handler.category = "tools";

export default handler;