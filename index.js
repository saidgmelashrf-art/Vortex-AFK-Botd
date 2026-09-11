const mineflayer = require('mineflayer');

const config = {
  host: 'Progamer-Smp.aternos.me',
  port: 29801,
  username: 'hello',
  password: 'MySecurePassword123',
  version: '1.21.11',
  auth: 'offline'
};

let bot = null;
let reconnectTimer = null;
let stopped = false;

function createBot() {
  if (stopped) return;

  console.log('================================');
  console.log('Starting bot...');
  console.log(`Server: ${config.host}:${config.port}`);
  console.log(`Username: ${config.username}`);
  console.log('================================');

  try {
    bot = mineflayer.createBot({
      host: config.host,
      port: config.port,
      username: config.username,
      version: config.version,
      auth: config.auth
    });
  } catch (err) {
    console.log('Failed to create bot:', err);
    reconnect();
    return;
  }

  bot.once('spawn', () => {
    console.log('================================');
    console.log('BOT SPAWNED SUCCESSFULLY');
    console.log('================================');

    // الحساب مسجل بالفعل
    setTimeout(() => {
      if (!bot || !bot.entity) return;

      console.log('Sending /login...');
      bot.chat(`/login ${config.password}`);
    }, 3000);
  });

  // حركة كل 30 ثانية
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
    console.log('================================');

    try {
      console.log(JSON.stringify(reason, null, 2));
    } catch {
      console.log(reason);
    }

    console.log('================================');
  });

  bot.on('error', (err) => {
    console.log('================================');
    console.log('BOT ERROR');
    console.log('================================');
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
  console.log('Received SIGTERM. Stopping bot...');
  stopped = true;

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }

  if (bot) {
    try {
      bot.quit();
    } catch {}
  }
});

process.on('SIGINT', () => {
  console.log('Received SIGINT. Stopping bot...');
  stopped = true;

  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
  }

  if (bot) {
    try {
      bot.quit();
    } catch {}
  }
});

createBot();
