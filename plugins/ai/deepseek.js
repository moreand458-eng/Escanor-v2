import axios from 'axios';

async function سؤال_deepseek(سؤال) {
    // نجرب نماذج متعددة لو واحد فشل
    const نماذج = ['deepseek', 'openai', 'mistral'];
    
    for (const نموذج of نماذج) {
        try {
            const res = await axios.post(
                'https://text.pollinations.ai/',
                {
                    messages: [
                        {
                            role: 'system',
                            content: 'أنت مساعد ذكاء اصطناعي متطور. أجب دائماً باللغة العربية بشكل واضح ومفصل.'
                        },
                        {
                            role: 'user',
                            content: سؤال
                        }
                    ],
                    model: نموذج,
                    seed: Math.floor(Math.random() * 99999)
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Mozilla/5.0'
                    },
                    timeout: 60000
                }
            );

            if (typeof res.data === 'string' && res.data.length > 5) return res.data;
            if (res.data?.choices?.[0]?.message?.content) return res.data.choices[0].message.content;
        } catch (e) {
            // لو 429 أو 402 جرب النموذج الجاي
            if (e.response?.status === 429 || e.response?.status === 402) continue;
            throw e;
        }
    }
    throw new Error('كل النماذج مشغولة دلوقتي، جرب بعد شوية');
}

const handler = async (m, { conn, text }) => {
    const سؤال = text || (m.quoted?.text);

    if (!سؤال) {
        return m.reply('*❌ اكتب سؤالك بعد الأمر*\n\nمثال: .ديبسيك ما هو الذكاء الاصطناعي؟');
    }

    m.react('🤖');
    try {
        const رد = await سؤال_deepseek(سؤال);

        await conn.sendMessage(m.chat, {
            text: `🤖 *DeepSeek AI*\n\n${رد}`
        }, { quoted: m });

        m.react('✅');
    } catch (e) {
        m.react('❌');
        m.reply(`*❌ فشل الاتصال بالذكاء الاصطناعي:*\n${e.message?.slice(0, 150)}`);
    }
};

handler.usage = ['ديبسيك'];
handler.command = ['ديبسيك', 'deepseek', 'dsk'];
handler.category = 'ai';

export default handler;
