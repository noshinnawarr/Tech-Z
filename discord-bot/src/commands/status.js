const { getStatus } = require('../apiClient');
const { formatStatus } = require('../formatters');
const { phrase } = require('../llm/phraser');

module.exports = {
  name: '!status',
  async execute(message) {
    const data = await getStatus();
    await message.reply(await phrase(formatStatus(data)));
  },
};
