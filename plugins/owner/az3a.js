const run = async (m, { conn, bot }) => {
  if (bot.isSubBot) return;
  if (!m.quoted) return m.reply("📝 قم بالرد على الرسالة التي تريد منشنها");
  
  const groups = await conn.groupFetchAllParticipating();
  const groupList = Object.values(groups);
  
  if (groupList.length === 0) return m.reply("📭 لا توجد مجموعات");
  
  let success = 0;
  
  for (const group of groupList) {
    try {
      const metadata = await conn.groupMetadata(group.id);
      const mentions = metadata.participants.map(p => p.id);
      
      await conn.sendMessage(group.id, {
        forward: m.quoted.fakeObj(),
        mentions: mentions
      });
      success++;
      await new Promise(r => setTimeout(r, 2000));
    } catch {}
  }
  
  await m.reply(`✅ تم المنشن لـ ${success} جروب`);
};

run.command = ["اذاعه"];
run.usage = ["اذاعه"];
run.category = "owner";
run.owner = true;
export default run;