// src/alerts/alertEngine.js
// Detects the two alert conditions and keeps a timestamped history.
//
// 1. After-hours: any device in a room is ON outside 9AM-4PM. Fires immediately
//    (no minimum duration) as one aggregated alert per room, e.g. "Work Room 2
//    still has 2 fans and 1 light ON after office hours."
// 2. Continuous-room: every device in a room has been ON, uninterrupted, for >2h.
//
// Each condition is deduped so it fires once per "session" (per room's
// after-hours-with-something-on streak, or per room's all-on streak) instead of
// spamming an alert every simulator tick.

const { ROOM_NAMES, getRoomDevices } = require('../state/devices');
const { OFFICE_HOURS, CONTINUOUS_ON_ALERT_MS, ALERT_TEST_MODE } = require('../config');

const MAX_HISTORY = 200;
const history = [];
const roomAfterHoursAlerted = new Set(); // room keys already alerted for their current after-hours streak
const roomContinuousAlerted = new Set(); // room keys already alerted for their current all-on streak

function isAfterHours() {
  if (ALERT_TEST_MODE) return true;
  const hour = new Date().getHours();
  return hour < OFFICE_HOURS.start || hour >= OFFICE_HOURS.end;
}

function describeOnDevices(devices) {
  const fansOn = devices.filter((d) => d.type === 'fan' && d.status === 'on').length;
  const lightsOn = devices.filter((d) => d.type === 'light' && d.status === 'on').length;
  const parts = [];
  if (fansOn > 0) parts.push(`${fansOn} fan${fansOn > 1 ? 's' : ''}`);
  if (lightsOn > 0) parts.push(`${lightsOn} light${lightsOn > 1 ? 's' : ''}`);
  return parts.join(' and ');
}

function pushAlert(id, type, message, roomKey) {
  const alert = {
    id,
    type,
    message,
    room: roomKey || null,
    roomName: roomKey ? ROOM_NAMES[roomKey] : null,
    timestamp: new Date().toISOString(),
  };
  history.push(alert);
  if (history.length > MAX_HISTORY) history.shift();
  return alert;
}

function evaluate() {
  const newAlerts = [];
  const afterHours = isAfterHours();

  for (const key of Object.keys(ROOM_NAMES)) {
    const roomDevices = getRoomDevices(key);
    const anyOn = roomDevices.some((d) => d.status === 'on');

    // After-hours: fires immediately once something's on, no duration threshold.
    if (!anyOn) {
      roomAfterHoursAlerted.delete(key);
    } else if (afterHours && !roomAfterHoursAlerted.has(key)) {
      roomAfterHoursAlerted.add(key);
      newAlerts.push(
        pushAlert(
          `${key}-afterhours-${Date.now()}`,
          'afterHours',
          `${ROOM_NAMES[key]} still has ${describeOnDevices(roomDevices)} ON after office hours. Did someone forget to switch them off?`,
          key
        )
      );
    }

    // Continuous-room: every device on, uninterrupted, for >2h.
    const allOn = roomDevices.every((d) => d.status === 'on');
    if (!allOn) {
      roomContinuousAlerted.delete(key);
      continue;
    }
    const allOnLongEnough = roomDevices.every(
      (d) => Date.now() - new Date(d.lastChanged).getTime() >= CONTINUOUS_ON_ALERT_MS
    );
    if (allOnLongEnough && !roomContinuousAlerted.has(key)) {
      roomContinuousAlerted.add(key);
      newAlerts.push(
        pushAlert(
          `${key}-continuous-${Date.now()}`,
          'continuousRoom',
          `${ROOM_NAMES[key]} has had every device ON for over 2 hours straight.`,
          key
        )
      );
    }
  }

  return newAlerts;
}

function getAlertsSince(sinceISO) {
  if (!sinceISO) return history.slice(-20);
  const sinceMs = new Date(sinceISO).getTime();
  return history.filter((a) => new Date(a.timestamp).getTime() > sinceMs);
}

function getAllAlerts() {
  return history;
}

module.exports = { evaluate, getAlertsSince, getAllAlerts };
