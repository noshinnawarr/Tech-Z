// src/state/simulator.js
// Randomly flips one device every tick so the demo always has something live to show.

const { getDevices, toggleDevice } = require('./devices');
const { SIMULATION_TICK_MS } = require('../config');

function startSimulator(onTick) {
  return setInterval(() => {
    const devices = getDevices();
    const device = devices[Math.floor(Math.random() * devices.length)];
    toggleDevice(device);
    onTick(device);
  }, SIMULATION_TICK_MS);
}

module.exports = { startSimulator };
