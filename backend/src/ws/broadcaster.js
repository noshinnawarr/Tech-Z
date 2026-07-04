// src/ws/broadcaster.js
// Pushes a full state snapshot to every connected dashboard client. Small device
// count (15) makes full snapshots simpler and cheap enough to not bother diffing.

const { WebSocketServer } = require('ws');
const { ROOM_NAMES, getRoomDevices, totalWatts } = require('../state/devices');
const { getAllAlerts } = require('../alerts/alertEngine');

function snapshot() {
  const rooms = Object.keys(ROOM_NAMES).map((key) => ({
    key,
    name: ROOM_NAMES[key],
    devices: getRoomDevices(key),
  }));
  const byRoom = {};
  for (const room of rooms) {
    byRoom[room.key] = room.devices.reduce((sum, d) => sum + d.watts, 0);
  }
  const watts = totalWatts();
  return {
    type: 'state',
    payload: {
      rooms,
      totalWatts: watts,
      todayKwh: +((watts * 5.5) / 1000).toFixed(2),
      byRoom,
      alerts: getAllAlerts().slice(-20),
    },
  };
}

function attachBroadcaster(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    ws.send(JSON.stringify(snapshot()));
  });

  function broadcast() {
    const message = JSON.stringify(snapshot());
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN) client.send(message);
    }
  }

  return { broadcast };
}

module.exports = { attachBroadcaster };
