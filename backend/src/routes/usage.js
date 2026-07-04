// GET /api/usage
const express = require('express');
const { ROOM_NAMES, getRoomDevices, totalWatts } = require('../state/devices');

const router = express.Router();

router.get('/usage', (req, res) => {
  const byRoom = {};
  for (const key of Object.keys(ROOM_NAMES)) {
    byRoom[key] = getRoomDevices(key).reduce((sum, d) => sum + d.watts, 0);
  }
  const watts = totalWatts();
  res.json({
    totalWatts: watts,
    todayKwh: +((watts * 5.5) / 1000).toFixed(2), // fake running estimate
    byRoom,
  });
});

module.exports = router;
