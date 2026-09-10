const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'Progamer-Smp.aternos.me', // أيبي السيرفر
  port: 29801,                   // البورت
  auth: 'offline',
  version: '1.20.4',             // إصدار السيرفر (تقدر تغيره لو إصدارك غير كده)
  username: 'hello'         // اسم البوت الجديد
});

bot.on('spawn', () => {
  console.log('Bot has spawned! Registering/Logging in...');
  
  // أول ما يدخل السيرفر، هيبعت أمر التسجيل تلقائي (غير كلمة السر دي باللي تعجبك)
  setTimeout(() => {
    bot.chat('/register MySecurePassword123 MySecurePassword123');
  }, 2000); // استجابة بعد ثانيتين من دخوله اللعبة
});

// حركة بسيطة لمنع الـ AFK وطرد السيرفر
setInterval(() => {
  bot.setControlState('jump', true);
  setTimeout(() => bot.setControlState('jump', false), 500);
}, 30000);

bot.on('kicked', (reason) => {
  console.log(`Bot was kicked for: ${reason}`);
});

bot.on('error', (err) => {
  console.log('Error encountered: ', err);
});

bot.on('end', () => {
  console.log('Bot disconnected. Reconnecting in 5 seconds...');
  setTimeout(() => {
    process.exit(1); 
  }, 5000);
});
