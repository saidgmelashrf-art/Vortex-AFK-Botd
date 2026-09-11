const mineflayer = require('mineflayer');

const config = {
  host: 'Progamer-Smp.aternos.me',
  port: 29801,
  username: 'bromax',
  password: 'MySecurePassword123',
  // تم حذف سطر version ليتعرف البوت على الإصدار تلقائياً
  auth: 'offline'
};

let bot = null;
let reconnectTimer = null;
let stopped = false;

function createBot() {
  if (stopped) return;

  console.log('================================');
  console.log('Starting bot (Auto-Detect Version)...');
  console.log(`Server: ${config.host}:${config.port}`);
  console.log(`Username: ${config.username}`);
  console.log('================================');

  try {
    bot = mineflayer.createBot({
      host: config.host,
      port: config.port,
      username: config.username,
      auth: config.auth
      // لا نمرر خاصية version هنا
    });
  } catch (err) {
    console.log('Failed to create bot:', err);
    reconnect();
    return;
  }

  bot.once('spawn', () => {
    console.log('================================');
    console.log('BOT SPAWNED SUCCESSFULLY');
    console.log(`Connected with version: ${bot.version}`);
    console.log('================================');

    // تنفيذ أمر التسجيل ثم الدخول
    setTimeout(() => {
      if (!bot || !bot.entity) return;

      console.log('Sending /register...');
      bot.chat(`/register ${config.password} ${config.password}`);

      setTimeout(() => {
        if (!bot || !bot.entity) return;
        
        console.log('Sending /login...');
        bot.chat(`/login ${config.password}`);
      }, 1500);
    }, 3000);
  });

  // حركة كل 30 ثانية لمنع الـ AFK Kick
  const jumpInterval = setInterval(() => {
    if (!bot || !bot.entity) return;

    try {
      bot.setControlState('jump', true);

      setTimeout(() => {
        if (bot && bot.entity) {
          bot.setControlState('jump', false);
        }
      }, 500);
    } catch (err) {
      console.log('Movement error:', err.message);
    }
  }, 30000);

  bot.on('kicked', (reason) => {
    console.log('================================');
    console.log('BOT KICKED');
    console.log(JSON.stringify(reason, null, 2));
    console.log('================================');
  });

  bot.on('error', (err) => {
    console.log('================================');
    console.log('BOT ERROR');
    console.log(err);
    console.log('================================');
  });

  bot.on('end', (reason) => {
    clearInterval(jumpInterval);

    console.log('================================');
    console.log('BOT DISCONNECTED');
    console.log('Reason:', reason || 'Unknown');
    console.log('================================');

    reconnect();
  });
}

function reconnect() {
  if (stopped) return;

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }

  console.log('Reconnecting in 15 seconds...');

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    createBot();
  }, 15000);
}

process.on('SIGTERM', () => {
  stopped = true;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (bot) try { bot.quit(); } catch {}
});

process.on('SIGINT', () => {
  stopped = true;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (bot) try { bot.quit(); } catch {}
});

createBot();
