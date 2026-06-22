/*
 * 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 BOT
 * 📢 واتساب : https://whatsapp.com/channel/0029VbBbvWcJ3jv1T55BmR0f
 * 🎬 يوتيوب : https://youtube.com/@escanor_soft-1
 * 📱 تيك توك : https://www.tiktok.com/@escanor_a1
 * 📨 تيليجرام : https://t.me/br_kan242
 * 📸 انستجرام : https://www.instagram.com/eid_abdalrhma
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);
// 20MB كافية جدًا دلوقتي لأن -loglevel error بيشيل لوج الفريمات اللي كانت بتفجر الـ maxBuffer
// timeout 30 ثانية عشان لو السيرفر ضعيف/الملف كبير، نوقف العملية بدل ما تهانج لیلا ونهارا
const FFMPEG_OPTS = { maxBuffer: 1024 * 1024 * 20, timeout: 30000 };
// أقصى مدة للفيديو الناتج (ثانية) - حماية من ستيكرات بمدة meta تالفة/ضخمة بتخلي ffmpeg يلوج آلاف الأسطر
const MAX_DURATION = 10;

const handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';

    if (!mime.includes('webp')) {
        return m.reply('*❌ رد على ملصق (ستيكر) عشان أحوله لفيديو*');
    }

    const tmp = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(tmp)) fs.mkdirSync(tmp);

    const stickerPath = path.join(tmp, `${Date.now()}_in.webp`);
    const videoPath = path.join(tmp, `${Date.now()}_out.mp4`);

    m.react('⏳');
    try {
        // 🔧 فحص: بعض الأحيان q.download() بترجع null/undefined لو فشل تحميل الميديا من واتساب
        // وده كان بيسبب: "The data argument must be of type string or an instance of Buffer..."
        const buffer = await q.download().catch(() => null);
        if (!buffer || !buffer.length) {
            throw new Error('NO_DOWNLOAD');
        }
        fs.writeFileSync(stickerPath, buffer);

        // نفحص بسرعة (ffprobe) لو الستيكر متحرك (له فريمات/مدة) أو ثابت
        // بدل "نجرب ونشوف" اللي بياخد وقت زيادة على سيرفر ضعيف
        let isAnimated = false;
        try {
            const { stdout } = await execAsync(
                `ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,duration -of csv=p=0 "${stickerPath}"`,
                { maxBuffer: 1024 * 1024 * 5, timeout: 8000 }
            );
            const [nbFrames, duration] = stdout.trim().split(',');
            isAnimated = (parseInt(nbFrames) > 1) || (parseFloat(duration) > 0.15);
        } catch {
            isAnimated = false; // فشل الفحص؟ نتعامل معاه كستيكر ثابت (أسرع وأضمن)
        }

        // 🔧 -loglevel error -hide_banner: يشيل لوج التقدم (frame=...) اللي ffmpeg
        // بيطبعه سطر بسطر لما الـ output مش تيرمنال حقيقي، وده كان السبب الحقيقي
        // وراء "stderr maxBuffer length exceeded" (مش حجم الفيديو نفسه)
        // و -t دايمًا (حتى للمتحرك) عشان نقفل أي ستيكر بمدة meta تالفة/ضخمة
        const scaleFilter = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';
        const cmd = isAnimated
            ? `ffmpeg -hide_banner -loglevel error -i "${stickerPath}" -t ${MAX_DURATION} -movflags +faststart -pix_fmt yuv420p -preset ultrafast -vf "${scaleFilter}" "${videoPath}" -y`
            : `ffmpeg -hide_banner -loglevel error -loop 1 -i "${stickerPath}" -t 3 -movflags +faststart -pix_fmt yuv420p -preset ultrafast -vf "${scaleFilter}" "${videoPath}" -y`;

        await execAsync(cmd, FFMPEG_OPTS);

        if (!fs.existsSync(videoPath) || !fs.statSync(videoPath).size) {
            throw new Error('EMPTY_OUTPUT');
        }

        await conn.sendMessage(m.chat, { video: fs.readFileSync(videoPath), mimetype: 'video/mp4' }, { quoted: m });
        m.react('✅');
    } catch (e) {
        m.react('❌');
        const isTimeout = e.killed || /timeout/i.test(e.message || '');
        const isNoDownload = e.message === 'NO_DOWNLOAD';
        const isEmpty = e.message === 'EMPTY_OUTPUT';

        const msg = isTimeout
            ? '*❌ التحويل خد وقت طويل جدًا وتم إيقافه. جرب ستيكر أصغر/أقصر*'
            : isNoDownload
                ? '*❌ معرفتش أحمل الستيكر من واتساب. جرب تاني، ولو الملصق قديم رد عليه تاني وابعته من جديد*'
                : isEmpty
                    ? '*❌ التحويل فشل ومطلعش فيديو، جرب ستيكر تاني*'
                    : `*❌ فشل التحويل:* ${e.message?.slice(0, 150)}`;
        m.reply(msg);
    } finally {
        if (fs.existsSync(stickerPath)) fs.unlinkSync(stickerPath);
        if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
    }
};

handler.usage = ['ستيكر_لفيديو'];
handler.command = ['ستيكر_لفيديو', 'sticker2video', 'tovideo', 'لفيديو'];
handler.category = 'sticker';

export default handler;
