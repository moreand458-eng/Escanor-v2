const handler = async (m, { conn, bot, text }) => {
    if (!text) return conn.sendMessage(m.chat, {
        text: `╮••─๋︩︪──๋︩︪─═⊐‹🔍›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ *بحث عن أنمي*
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
> │┊ ۬.͜ـ📌˖ ⟨الصيغة: .بحث_انمي اسم الأنمي☇
> │┊ ۬.͜ـ💡˖ ⟨مثال: .بحث_انمي naruto☇
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ─๋︩︪─═⊐‹𝐄𝐒𝐂𝐍𝐎𝐑 𝐁𝐎𝐓›⊏═─๋︩︪─⊰ـ`.trim()
    }, { quoted: m });

    try {
        m.react("🔍");

        const res = await fetch(
            `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=5&sfw=true`
        );
        const data = await res.json();
        const results = data?.data;

        if (!results || results.length === 0) {
            m.react("❌");
            return m.reply('❌ مش لاقي نتائج للبحث ده، جرب اسم تاني');
        }

        m.react("✅");

        for (const anime of results) {
            const title = anime.title_arabic || anime.title || 'بدون عنوان';
            const titleEn = anime.title_english || anime.title || '';
            const score = anime.score ? `⭐ ${anime.score}/10` : 'غير متاح';
            const episodes = anime.episodes ? `${anime.episodes} حلقة` : 'غير معروف';
            const status = anime.status || 'غير معروف';
            const type = anime.type || 'غير معروف';
            const synopsis = anime.synopsis
                ? anime.synopsis.slice(0, 200) + (anime.synopsis.length > 200 ? '...' : '')
                : 'لا يوجد وصف';
            const img = anime.images?.jpg?.image_url || anime.images?.jpg?.large_image_url;
            const url = anime.url || '';
            const genres = anime.genres?.map(g => g.name).join(' • ') || 'غير محدد';

            const caption = `╮••─๋︩︪──๋︩︪─═⊐‹🎌›⊏═─๋︩︪──๋︩︪─┈☇
╿↵ *نتيجة بحث الأنمي*
── • ◈ • ──
╮─ׅ─๋︩︪─┈─๋︩︪─═⊐‹𝐄𝐒𝐂𝐍𝐎𝐑 𝐁𝐎𝐓›⊏═┈ ─๋︩︪─ ∙ ∙ ⊰ـ
┤─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪─☇ـ
> │┊ ۬.͜ـ🎌˖ ⟨الاسم: ${title}☇
> │┊ ۬.͜ـ🔤˖ ⟨بالإنجليزي: ${titleEn}☇
> │┊ ۬.͜ـ⭐˖ ⟨التقييم: ${score}☇
> │┊ ۬.͜ـ📺˖ ⟨النوع: ${type}☇
> │┊ ۬.͜ـ🎬˖ ⟨الحلقات: ${episodes}☇
> │┊ ۬.͜ـ📡˖ ⟨الحالة: ${status}☇
> │┊ ۬.͜ـ🏷️˖ ⟨التصنيفات: ${genres}☇
> │┊ ۬.͜ـ📝˖ ⟨القصة: ${synopsis}☇
┤└─ׅ─ׅ┈ ─๋︩︪──ׅ─ׅ┈ ─๋︩︪☇ـ
╯─ׅ─๋︩︪─═⊐‹𝐄𝐒𝐂𝐍𝐎𝐑 𝐁𝐎𝐓›⊏═─๋︩︪─⊰ـ`.trim();

            if (img) {
                await conn.sendMessage(m.chat, {
                    image: { url: img },
                    caption,
                    contextInfo: {
                        isForwarded: true,
                        forwardingScore: 1,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363422581600030@newsletter',
                            newsletterName: '𝐄𝐒𝟏 ~ 𝐂𝐡𝐚𝐧𝐧𝐞𝐥 🕷️',
                            serverMessageId: 0
                        },
                        externalAdReply: {
                            title: title,
                            body: `${score} • ${type} • ${episodes}`,
                            thumbnailUrl: img,
                            sourceUrl: url,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: caption }, { quoted: m });
            }
        }

    } catch (e) {
        m.react("❌");
        await m.reply(`❌ حصل خطأ: ${e.message}`);
    }
};

handler.command = ['بحث_انمي', 'بحث-انمي', 'anime'];
handler.category = 'search';
handler.usage = ['بحث_انمي'];
handler.disabled = false;
handler.cooldown = 3000;

export default handler;