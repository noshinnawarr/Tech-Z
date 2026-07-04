// src/commands/help.js
module.exports = {
  name: '!help',
  async execute(message) {
    await message.reply(
      '**Office Bot Commands**\n' +
      '`!status` — overview of all rooms\n' +
      '`!room <name>` — details for one room (drawing / work1 / work2)\n' +
      '`!usage` — current power draw and today\'s estimate'
    );
  },
};
