// src/apiClient.js
const { API_BASE } = require('./config');

async function getStatus() {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error(`status ${res.status}`);
  return res.json();
}

// Returns null if the room doesn't exist (caller sends the friendly 404 message).
async function getRoom(roomName) {
  const res = await fetch(`${API_BASE}/rooms/${roomName.toLowerCase()}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`room ${res.status}`);
  return res.json();
}

async function getUsage() {
  const res = await fetch(`${API_BASE}/usage`);
  if (!res.ok) throw new Error(`usage ${res.status}`);
  return res.json();
}

async function getAlerts(sinceISO) {
  const url = sinceISO ? `${API_BASE}/alerts?since=${encodeURIComponent(sinceISO)}` : `${API_BASE}/alerts`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`alerts ${res.status}`);
  return res.json();
}

module.exports = { getStatus, getRoom, getUsage, getAlerts };
