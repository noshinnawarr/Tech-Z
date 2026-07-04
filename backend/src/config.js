// src/config.js
require('dotenv').config({ quiet: true });

const PORT = Number(process.env.PORT) || 5000;
const OFFICE_HOURS = { start: 9, end: 16 };
const CONTINUOUS_ON_ALERT_MS = 2 * 60 * 60 * 1000; // 2 hours
const ALERT_TEST_MODE = process.env.ALERT_TEST_MODE === 'true';
const SIMULATION_TICK_MS = 8000;

module.exports = { PORT, OFFICE_HOURS, CONTINUOUS_ON_ALERT_MS, ALERT_TEST_MODE, SIMULATION_TICK_MS };
