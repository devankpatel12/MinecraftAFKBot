const keepAlive = require('./keepalive');
keepAlive();

const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

const bot = mineflayer.createBot({
  host: 'Lolaworld.aternos.me',
  port: 50032,
  username: 'AFK_Bot',
  auth: 'offline'
});

bot.once('spawn', () => {
  console.log('✅ Bot has joined the server!');
  bot.chat('I will move 10 blocks every 15 seconds!');

  bot.loadPlugin(pathfinder);
  const mcData = require('minecraft-data')(bot.version);
  const defaultMove = new Movements(bot, mcData);

  setInterval(() => {
    const pos = bot.entity.position;
    const direction = Math.floor(Math.random() * 4); // 0 = +x, 1 = -x, 2 = +z, 3 = -z
    let x = pos.x;
    let z = pos.z;

    switch (direction) {
      case 0: x += 10; break; // East
      case 1: x -= 10; break; // West
      case 2: z += 10; break; // South
      case 3: z -= 10; break; // North
    }

    const goal = new goals.GoalBlock(Math.floor(x), Math.floor(pos.y), Math.floor(z));
    bot.pathfinder.setMovements(defaultMove);
    bot.pathfinder.setGoal(goal);

    console.log(`➡️ Moving to (${Math.floor(x)}, ${Math.floor(pos.y)}, ${Math.floor(z)})`);
  }, 15000); // Move every 15 seconds
});

bot.on('end', () => {
  console.log('❌ Bot disconnected. Reconnecting...');
  setTimeout(() => bot.connect(), 5000);
});

bot.on('error', err => console.log('❌ Error:', err));
