const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
  host: 'Progamer-Smp.aternos.me', // استبدل ده بأيبي سيرفرك
  port: 29801,             // بورت السيرفر
  auth: 'offline',         // نوع الدخول (كراتش / أوفلاين)
  version: '1.20.4',       // إصدار سيرفرك
  username: 'iam3mkbro'    // اسم البوت المخصص
});

bot.on('spawn', () => {
  console.log('Bot has spawned and is now online!');
  
  // أول ما البوت يدخل، هيبعت أمر الدخول تلقائياً بعد ثانيتين (غير كلمة المرور دي بالكلمة السرية بتاعت الحساب)
  setTimeout(() => {
    bot.chat('/login YOUR_PASSWORD_HERE');
  }, 2000);

  // حركة بسيطة كل 30 ثانية عشان السيرفر مايعتبركش خامل ويطردك (AFK)
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 30000);
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
    process.exit(1); 
  }, 5000);
});
