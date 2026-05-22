import { addSection, getSections, getDB, saveDB } from '../../lib/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const handler = async (m, { conn }) => {
    const subCmd = m.args[0];

    if (subCmd === 'قائمه' || subCmd === 'list') {
        const sections = getSections();
        const list = sections.map((s, i) => `${i + 1}. ${s.emoji || '📌'} ${s.name} (${s.id})`).join('\n');
        await conn.sendMessage(m.chat, {
            text: `╭•─•─•─•─•─•─•─•─•─•┈●
│ 📋 قائمة الأقسام
╰•─•─•─•─•─•─•─•─•─•

${list}

💡 الأقسام الكلية: ${sections.length}`,
        }, { quoted: m });
        return;
    }

    if (!m.q) {
        await conn.sendMessage(m.chat, {
            text: `❌ طريقة الاستخدام:\n.اضافه-قسم [id] | [emoji] | [اسم] | [العنوان]\n\nمثال:\n.اضافه-قسم .ق12 | 🎭 | قسم_الترفيه | 🍬┊「قـسـم_الـترفيه」🍨\n\n.اضافه-قسم قائمه - لعرض الأقسام`,
        }, { quoted: m });
        return;
    }

    const parts = m.q.split('|').map(p => p.trim());
    if (parts.length < 3) {
        await conn.sendMessage(m.chat, { text: '❌ يجب تحديد: id | emoji | اسم | عنوان' }, { quoted: m });
        return;
    }

    const [id, emoji, name, title] = parts;
    const section = {
        id: id || `.ق${Date.now()}`,
        emoji: emoji || '📌',
        name: name || 'قسم_جديد',
        title: title || name,
        header: `${emoji || '📌'}┊القسم الجديد`,
        createdAt: Date.now()
    };

    addSection(section);

    const folderName = name.replace(/\s+/g, '_');
    const sectionDir = path.join(__dirname, '../../plugins', folderName);
    if (!fs.existsSync(sectionDir)) {
        fs.mkdirSync(sectionDir, { recursive: true });
        fs.writeFileSync(path.join(sectionDir, `${folderName}-menu.js`), `// قسم ${name}\nconst handler = async (m, { conn }) => {\n    await conn.sendMessage(m.chat, { text: 'قسم ${name} - قيد الإنشاء' }, { quoted: m });\n};\nhandler.command = ['${id.replace('.', '')}'];\nexport default handler;\n`);
    }

    await conn.sendMessage(m.chat, {
        text: `✅ تم إضافة قسم "${name}" بنجاح!\n📌 ID: ${id}\n${emoji} الإيموجي: ${emoji}`,
    }, { quoted: m });
};

handler.command = ['اضافه-قسم', 'إضافة-قسم', 'addsection'];
handler.tags = ['dev'];
handler.devOnly = true;
export default handler;