// GET /api/alerts?since=<ISO8601>  -- returns only alerts newer than `since` (or the last 20 if omitted)
const express = require('express');
const { getAlertsSince } = require('../alerts/alertEngine');

const router = express.Router();

router.get('/alerts', (req, res) => {
  res.json({ new: getAlertsSince(req.query.since) });
});

module.exports = router;
