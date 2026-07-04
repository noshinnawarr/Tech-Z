// src/config.js
require('dotenv').config({ quiet: true });

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const API_BASE = process.env.BACKEND_API_URL;

if (!DISCORD_TOKEN) throw new Error('Missing DISCORD_TOKEN in .env');
if (!API_BASE) throw new Error('Missing BACKEND_API_URL in .env');

// Optional: enables proactive alert posting. If unset, alertWatcher stays disabled.
const ALERT_CHANNEL_ID = process.env.ALERT_CHANNEL_ID || null;
const ALERT_POLL_INTERVAL_MS = Number(process.env.ALERT_POLL_INTERVAL_MS) || 60000;

// Optional: enables LLM-phrased replies via Groq's free-tier API (console.groq.com).
// If the key is unset or the request fails, commands fall back to the plain formatters.
const GROQ_API_KEY = process.env.GROQ_API_KEY || null;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

module.exports = {
  DISCORD_TOKEN,
  API_BASE,
  ALERT_CHANNEL_ID,
  ALERT_POLL_INTERVAL_MS,
  GROQ_API_KEY,
  GROQ_MODEL,
};
