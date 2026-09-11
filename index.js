const mineflayer = require('mineflayer');

const config = {
  host: 'Progamer-Smp.aternos.me',
  port: 29801,
  auth: 'offline',
  version: '1.20.4',
  username: 'hello',
  password: 'MySecurePassword123'
};

let bot;

function createBot() {
  console.log('Starting bot...');

  bot = mineflayer.createBot({
    host: config.host,
    port: config.port,
    auth: config.auth,
    version: config.version,
    username: config.username
  });

  // عند دخول السيرفر
  bot.once('spawn', () => {
    console.log('Bot spawned successfully!');

    // الحساب مسجل بالفعل، لذلك نستخدم login
    setTimeout(() => {
      console.log('Sending login command...');
      bot.chat(`/login ${config.password}`);
    }, 3000);
  });

  // حركة بسيطة لمنع AFK
  const jumpInterval = setInterval(() => {
    if (bot && bot.entity) {
      bot.setControlState('jump', true);

      setTimeout(() => {
        if (bot) {
          bot.setControlState('jump', false);
        }
      }, 500);
    }
  }, 30000);

  // سبب الطرد
  bot.on('kicked', (reason) => {
    console.log('================================');
    console.log('BOT KICKED');
    console.log('================================');

    try {
      console.log(JSON.stringify(reason, null, 2));
    } catch (e) {
      console.log(reason);
    }

    console.log('================================');
  });

  // الأخطاء
  bot.on('error', (err) => {
    console.log('================================');
    console.log('BOT ERROR');
    console.log('================================');
    console.log(err);
    console.log('================================');
  });

  // عند انقطاع الاتصال
  bot.on('end', () => {
    clearInterval(jumpInterval);

    console.log('Bot disconnected.');
    console.log('Reconnecting in 10 seconds...');

    setTimeout(() => {
      createBot();
    }, 10000);
  });
}

createBot();
