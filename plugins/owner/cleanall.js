import { execSync } from "child_process";

const handler = async (m, { conn }) => {
  try {
    m.react("🧹");
    await m.reply("*🧹 جاري التنظيف الشامل...*");

    let report = [];
    let totalCleaned = 0;

    const clean = (cmd, label) => {
      try {
        const count = execSync(
          `files=$(find ${cmd} 2>/dev/null | wc -l); rm -rf ${cmd} 2>/dev/null; echo $files`,
          { encoding: "utf-8" }
        ).trim();
        const n = parseInt(count) || 0;
        totalCleaned += n;
        if (n > 0) report.push(`🗑️ ${label}: *${n} ملف*`);
      } catch {}
    };

    // session keys
    clean("session/pre-key-*", "Session Keys");
    clean("session/device-list-*", "Device List");
    clean("session/sender-key-*", "Sender Keys");
    clean("session/app-state-*", "App State");

    // tmp & logs
    clean("/tmp/*", "Temp Files");
    clean("logs/*", "Logs");
    clean("store/*", "Store Cache");

    // npm cache
    try {
      execSync("npm cache clean --force 2>/dev/null", { encoding: "utf-8" });
      report.push("✅ NPM Cache: *تم التنظيف*");
    } catch {}

    const diskAfter = execSync("df -h / | tail -1", { encoding: "utf-8" }).trim();
    const avail = diskAfter.split(/\s+/)[3];

    m.react("🟢");
    await conn.sendMessage(m.chat, {
      text: `*✅ تم التنظيف الشامل*\n\n` +
        `${report.length ? report.join("\n") : "لا يوجد ملفات للمسح"}\n\n` +
        `📦 *إجمالي المحذوف:* ${totalCleaned} ملف\n` +
        `💾 *المساحة المتاحة الآن:* ${avail}`
    }, { quoted: m });

  } catch (e) {
    await m.reply(`\`\`\`${e.message}\`\`\``);
  }
};

handler.command = ["تنظيف_شامل"];
handler.usage = ["تنظيف_شامل"];
handler.category = "owner";
handler.owner = true;
handler.disabled = false;

export default handler;