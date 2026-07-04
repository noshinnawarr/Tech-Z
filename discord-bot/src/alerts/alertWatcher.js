// src/alerts/alertWatcher.js
// Polls the shared backend for new alerts and proactively posts them to a
// designated Discord channel (bonus feature from the spec).

const { getAlerts } = require('../apiClient');
const { ALERT_CHANNEL_ID, ALERT_POLL_INTERVAL_MS } = require('../config');

function startAlertWatcher(client) {
  if (!ALERT_CHANNEL_ID) {
    console.log('ALERT_CHANNEL_ID not set — proactive alert posting disabled.');
    return null;
  }

  // Tracks alert IDs already posted by this bot process. A timestamp cutoff would
  // miss alerts that were already active (fired by the backend, deduped so they
  // won't fire again) before the bot last started — this catches those too.
  const postedIds = new Set();

  return setInterval(async () => {
    try {
      const { new: alerts } = await getAlerts();
      const unposted = alerts.filter((alert) => !postedIds.has(alert.id));
      if (unposted.length === 0) return;

      const channel = await client.channels.fetch(ALERT_CHANNEL_ID);
      for (const alert of unposted) {
        await channel.send(`⚠️ ${alert.message}`);
        postedIds.add(alert.id);
      }
    } catch (err) {
      console.error('Alert watcher error:', err.message);
    }
  }, ALERT_POLL_INTERVAL_MS);
}

module.exports = { startAlertWatcher };
