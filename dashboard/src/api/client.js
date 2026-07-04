// REST fallback used only for the very first paint, before the WebSocket
// connection finishes its handshake (or if it never manages to connect).
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export async function getInitialSnapshot() {
  const [statusRes, usageRes, alertsRes] = await Promise.all([
    fetch(`${API_BASE}/status`),
    fetch(`${API_BASE}/usage`),
    fetch(`${API_BASE}/alerts`),
  ]);
  const [status, usage, alertsData] = await Promise.all([
    statusRes.json(),
    usageRes.json(),
    alertsRes.json(),
  ]);
  return {
    rooms: status.rooms,
    totalWatts: usage.totalWatts,
    todayKwh: usage.todayKwh,
    byRoom: usage.byRoom,
    alerts: alertsData.new,
  };
}
