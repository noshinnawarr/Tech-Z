// GET /api/status
const express = require('express');
const { ROOM_NAMES, getRoomDevices } = require('../state/devices');

const router = express.Router();

router.get('/status', (req, res) => {
  const rooms = Object.keys(ROOM_NAMES).map((key) => ({
    key,
    name: ROOM_NAMES[key],
    devices: getRoomDevices(key),
  }));
  res.json({ rooms });
});

module.exports = router;
