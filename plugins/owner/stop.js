const test = async (m, { conn, bot }) => {
  m.react("🟢")
  
  conn.msgUrl(m.chat, "♡゙ Stop the bot...", { 
    title: "ESCANOR 𝘪𝘴 𝘢 𝘞𝘩𝘢𝘵𝘴𝘈𝘱𝘱 𝘣𝘰𝘵 𝘧𝘳𝘰𝘮 𝘵𝘩𝘦 ESC𝘓𝘐𝘕𝘒 𝘓𝘪𝘣𝘳𝘢𝘳𝘺",
    body: "𝑇𝒉𝑒 𝑏𝑜𝑡 𝑖𝑠 𝑠𝑖𝑚𝑝𝑙𝑒 𝑡𝑜 𝑚𝑜𝑑𝑖𝑓𝑦",
    img: "https://i.postimg.cc/XJX2cRJc/0af18dd2b2543651464204773234c433.jpg",
    big: false 
  });
  
  setTimeout(() => {
    bot.stop();
  }, 1000); 
};

test.category = "owner";
test.command = ["ايقاف", "stop"];
test.usage = ["ايقاف"];
test.owner = true;
export default test;
