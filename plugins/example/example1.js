/* 
by: ES ~ ESCANOR
*/

const example = async (m, { conn }) => {

conn.msgUrl(m.chat,
  '*🔥 Special Offer*',
  {
    img: 'https://example.com/promo.jpg',
    title: '50% OFF',
    body: 'Limited time',
    big: true,
    mentions: ['201234567890@s.whatsapp.net', '201111111111@s.whatsapp.net'],
    newsletter: {
      name: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
      jid: '120363422581600030@newsletter'
    }
  },
  m
)

};

example.usage = ["تست1"]


/* ↓ قسم الأمر ↓ */
example.category = "example"


/* ↓ استخدم الأوامر ↓ */
example.command = ["تست1"] 


/* ↓ بتعمل ايقاف ل الأمر ↓ */
example.disabled = false // لو عملتها true الأمر كده مش هيشتغل

/* ↓ استخدام الأمر بعد ثانيه من الاستخدام لمنع الاسبام ↓ */
example.cooldown = 1000; // تقدر تزود الثواني 


/* ↓ استخدام الأمر ب بدايه أو لا ↓ */
example.usePrefix = false; // لو عملتها true الأمر هيبقي من غير بدايه 

export default example;