const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'IP_SERVER_HERE', // استبدل ده بأيبي سيرفر الماينكرافت
  port: 25565,             // بورت السيرفر (افتراضي غالباً 25565)
  auth: 'offline',         // نوع الدخول (offline لو السيرفر مش أصلي / کراک)
  version: '1.20.4',       // إصدار اللعبة (غيره حسب إصدار سيرفرك لو لزم)
  username: 'AFK_Bot'      // اسم البوت جوه اللعبة
});

bot.on('spawn', () => {
  console.log('Bot has spawned and is now online!');
  
  // حركة بسيطة كل شوية عشان السيرفر مايعتبركش بتعمل Spam أو طرد للخمول
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 30000); // بينط كل 30 ثانية
});

bot.on('kicked', (reason) => {
  console.log(`Bot was kicked for: ${reason}`);
});

bot.on('error', (err) => {
  console.log('Error encountered: ', err);
});

bot.on('end', () => {
  console.log('Bot disconnected. Reconnecting in 5 seconds...');
  setTimeout(() => {
    // يحاول يرجع يدخل لو اتفصل
    process.exit(1); 
  }, 5000);
});
