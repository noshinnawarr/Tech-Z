// src/formatters.js
// Turns raw backend JSON into friendly Discord messages.

function summarizeDevices(devices) {
  const fansOn = devices.filter((d) => d.type === 'fan' && d.status === 'on').length;
  const lightsOn = devices.filter((d) => d.type === 'light' && d.status === 'on').length;
  if (fansOn === 0 && lightsOn === 0) return 'all off';
  const parts = [];
  if (fansOn > 0) parts.push(`${fansOn} fan${fansOn > 1 ? 's' : ''} ON`);
  if (lightsOn > 0) parts.push(`${lightsOn} light${lightsOn > 1 ? 's' : ''} ON`);
  return parts.join(', ');
}

function formatStatus(data) {
  const lines = data.rooms.map((r) => `**${r.name}**: ${summarizeDevices(r.devices)}.`);
  return lines.join('\n');
}

function formatRoom(room) {
  const deviceLines = room.devices
    .map((d) => {
      const label = `${d.type === 'fan' ? 'Fan' : 'Light'} (${d.id})`;
      return `• ${label} — ${d.status.toUpperCase()}${d.status === 'on' ? ` (${d.watts}W)` : ''}`;
    })
    .join('\n');
  return `**${room.name}**\n${deviceLines}`;
}

function formatUsage(data) {
  const roomBreakdown = Object.entries(data.byRoom)
    .map(([key, watts]) => `${key}: ${watts}W`)
    .join(', ');
  return `Total power right now: **${data.totalWatts}W**. Today's estimated usage: **${data.todayKwh} kWh**.\n(By room — ${roomBreakdown})`;
}

module.exports = { summarizeDevices, formatStatus, formatRoom, formatUsage };
