// GET /api/rooms/:name  (name = drawing | work1 | work2)
const express = require('express');
const { ROOM_NAMES, getRoomDevices } = require('../state/devices');

const router = express.Router();

router.get('/rooms/:name', (req, res) => {
  const key = req.params.name.toLowerCase();
  if (!ROOM_NAMES[key]) {
    return res.status(404).json({ error: `Unknown room "${req.params.name}"` });
  }
  res.json({ key, name: ROOM_NAMES[key], devices: getRoomDevices(key) });
});

module.exports = router;
