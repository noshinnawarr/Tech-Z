const { getRoom } = require('../apiClient');
const { formatRoom } = require('../formatters');
const { phrase } = require('../llm/phraser');

module.exports = {
  name: '!room',
  async execute(message, args) {
    const roomName = args[1];
    if (!roomName) {
      return message.reply('Usage: `!room <name>` — e.g. `!room work1`, `!room drawing`, `!room work2`');
    }
    const data = await getRoom(roomName);
    if (!data) {
      return message.reply(`I couldn't find a room called "${roomName}". Try \`drawing\`, \`work1\`, or \`work2\`.`);
    }
    await message.reply(await phrase(formatRoom(data)));
  },
};
