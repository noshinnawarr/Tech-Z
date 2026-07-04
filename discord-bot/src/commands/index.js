// src/commands/index.js
// Registry mapping command name -> handler. Add new commands by creating a
// file in this folder and listing it here.
const status = require('./status');
const room = require('./room');
const usage = require('./usage');
const help = require('./help');

const commands = new Map([status, room, usage, help].map((cmd) => [cmd.name, cmd]));

module.exports = { commands };
