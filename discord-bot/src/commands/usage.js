const { getUsage } = require('../apiClient');
const { formatUsage } = require('../formatters');
const { phrase } = require('../llm/phraser');

module.exports = {
  name: '!usage',
  async execute(message) {
    const data = await getUsage();
    await message.reply(await phrase(formatUsage(data)));
  },
};
