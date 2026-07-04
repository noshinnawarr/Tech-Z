// index.js
const { Client, Intents } = require('discord.js');
const { DISCORD_TOKEN } = require('./src/config');
const { commands } = require('./src/commands');
const { startAlertWatcher } = require('./src/alerts/alertWatcher');

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
  ],
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  startAlertWatcher(client);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return; // ignore bots, including itself

  const args = message.content.trim().split(/\s+/);
  const command = commands.get(args[0].toLowerCase());
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (err) {
    console.error('Command error:', err);
    await message.reply("Sorry, I couldn't reach the office system right now. Is the backend running?");
  }
});

client.login(DISCORD_TOKEN);
