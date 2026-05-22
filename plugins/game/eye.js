/*
code: game eye anime
by: 𝐄𝐒𝐂𝐀𝐍𝛩𝐑 
*/

const MAX_ROUNDS = 10;

const NAMES = [
  "ايرين","نيزوكو","سوكونا","موازن","كيلوا","غون","ايتاتشي","ساسكي","دابي","اوبيتو",
  "نوبارا","ليفاي","يوتا","فريدا","شيده","ياماتو","نامي","ايمو","انيا","جينبي",
  "بوروتو","شانكس","لاو","لوفي","زورو","اكازا","ميكاسا","رين","دوما","كانيكي",
  "غوجو","ساي","نيجي","انمي","ساكورا","اوريتشمارو","ماهيتو","جيرايا","روبين",
  "سانجي","ميهوك","كايدو","مايكي","كورابيكا","شيغاراكي","تينغن","تانجيرو",
  "ميدوريا","كونان","الكيورا","شوتو","غاتارو","بارو","غارا","باكوغو","ماكيما",
  "توجا","باين","كوراما"
];

const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

const getPrize = (rank) => {
  if (rank === 0) return { xp: 500, cookies: 10, emoji: "🎉" };
  if (rank === 1) return { xp: 300, cookies: 5, emoji: "🎖" };
  return { xp: 100, cookies: 2, emoji: "⭐" };
};

const handler = async (m, { conn }) => {
  const chatId = m.chat;
  if (!global.gameEye) global.gameEye = {};
  
  const g = global.gameEye[chatId];
  if (g?.current) return await conn.sendMessage(chatId, {
    image: { url: g.current.img },
    caption: g.current.caption
  });

  if (!g || g.round >= MAX_ROUNDS) {
    if (g) {
      const sorted = Object.entries(g.scores).sort((a,b) => b[1] - a[1]);
      const prizes = [];
      
      for (let i = 0; i < sorted.length; i++) {
        const [id, score] = sorted[i];
        const prize = getPrize(i);
        if (global.db?.users[id]) {
          global.db.users[id].xp = (global.db.users[id].xp || 0) + prize.xp;
          global.db.users[id].cookies = (global.db.users[id].cookies || 0) + prize.cookies;
        }
        prizes.push(`${prize.emoji} @${id.split('@')[0]} - ${score} نقطة (+${prize.xp}xp)`);
      }
      
      await conn.sendMessage(chatId, {
        text: `🏆 *انتهت اللعبة*\n\n${prizes.join('\n')}`,
        mentions: sorted.map(s => s[0])
      });
    }
    global.gameEye[chatId] = { round: 0, scores: {}, current: null };
  }

  const g2 = global.gameEye[chatId];
  g2.round++;
  
  const data = await fetch("https://raw.githubusercontent.com/fjfilhfjjg-boop/Escanor-bot/refs/heads/main/%D8%B9%D9%8A%D9%86.md").then(r => r.json());
  const char = data[Math.floor(Math.random() * data.length)];
  
  const wrong = shuffle([...NAMES]).filter(n => n !== char.name).slice(0, 3);
  const opts = shuffle([char.name, ...wrong]);
  
  const caption = `👁 خمن الشخصية (${g2.round}/${MAX_ROUNDS})\n\n1. ${opts[0]}\n2. ${opts[1]}\n3. ${opts[2]}\n4. ${opts[3]}`;
  
  const msg = await conn.sendMessage(chatId, {
    image: { url: char.img },
    caption
  });
  
  g2.current = {
    answer: char.name.toLowerCase(),
    opts: opts.map(o => o.toLowerCase()),
    img: char.img,
    caption,
    id: msg.key.id,
    timer: setTimeout(async () => {
      if (global.gameEye[chatId]?.current) {
        const ans = global.gameEye[chatId].current.answer;
        global.gameEye[chatId].current = null;
        await conn.sendMessage(chatId, { text: `⏰ الوقت انتهى! الاجابة: *${ans}*\nاكتب .عين للبدء من جديد` });
      }
    }, 30000)
  };
};

handler.before = async (m, { conn }) => {
  const g = global.gameEye?.[m.chat];
  if (!g?.current) return;
  
  const cur = g.current;
  if (m.quoted?.id !== cur.id && m.text?.toLowerCase() !== cur.answer) return;
  
  const answer = m.text.toLowerCase().trim();
  if (!cur.opts.includes(answer)) return m.reply("❌ غلط");
  
  clearTimeout(cur.timer);
  g.current = null;
  
  if (answer === cur.answer) {
    g.scores[m.sender] = (g.scores[m.sender] || 0) + 1;
    await conn.sendMessage(m.chat, {
      text: `✅ صح! عندك ${g.scores[m.sender]} نقطة\nانتظر الجولة القادمة...`,
      mentions: [m.sender]
    });
    setTimeout(() => handler(m, { conn }), 200);
  } else {
    await m.reply("❌ غلط");
  }
  return true;
};

handler.command = ['عين', 'eye'];
handler.usage = ['عين'];
handler.category = "games";
export default handler;