// src/state/devices.js
// Single source of truth for the 15 simulated office devices (2 fans + 3 lights x 3 rooms).

const ROOM_NAMES = {
  drawing: 'Drawing Room',
  work1: 'Work Room 1',
  work2: 'Work Room 2',
};

function makeDevice(id, type, room, status, watts) {
  return {
    id,
    type,          // 'fan' | 'light'
    room,          // 'drawing' | 'work1' | 'work2'
    status,        // 'on' | 'off'
    watts: status === 'on' ? watts : 0,
    lastChanged: new Date().toISOString(),
  };
}

const devices = [
  makeDevice('drawing-fan-1', 'fan', 'drawing', 'off', 60),
  makeDevice('drawing-fan-2', 'fan', 'drawing', 'on', 60),
  makeDevice('drawing-light-1', 'light', 'drawing', 'on', 15),
  makeDevice('drawing-light-2', 'light', 'drawing', 'off', 15),
  makeDevice('drawing-light-3', 'light', 'drawing', 'off', 15),

  makeDevice('work1-fan-1', 'fan', 'work1', 'off', 60),
  makeDevice('work1-fan-2', 'fan', 'work1', 'off', 60),
  makeDevice('work1-light-1', 'light', 'work1', 'off', 15),
  makeDevice('work1-light-2', 'light', 'work1', 'off', 15),
  makeDevice('work1-light-3', 'light', 'work1', 'off', 15),

  makeDevice('work2-fan-1', 'fan', 'work2', 'on', 60),
  makeDevice('work2-fan-2', 'fan', 'work2', 'on', 60),
  makeDevice('work2-light-1', 'light', 'work2', 'on', 15),
  makeDevice('work2-light-2', 'light', 'work2', 'on', 15),
  makeDevice('work2-light-3', 'light', 'work2', 'on', 15),
];

function getDevices() {
  return devices;
}

function getRoomDevices(key) {
  return devices.filter((d) => d.room === key);
}

function toggleDevice(device) {
  device.status = device.status === 'on' ? 'off' : 'on';
  device.watts = device.status === 'on' ? (device.type === 'fan' ? 60 : 15) : 0;
  device.lastChanged = new Date().toISOString();
}

function totalWatts() {
  return devices.reduce((sum, d) => sum + d.watts, 0);
}

module.exports = { ROOM_NAMES, getDevices, getRoomDevices, toggleDevice, totalWatts };
