// src/server.js
const http = require('http');
const express = require('express');
const cors = require('cors');

const { PORT } = require('./config');
const { startSimulator } = require('./state/simulator');
const { evaluate } = require('./alerts/alertEngine');
const { attachBroadcaster } = require('./ws/broadcaster');

const statusRoute = require('./routes/status');
const roomsRoute = require('./routes/rooms');
const usageRoute = require('./routes/usage');
const alertsRoute = require('./routes/alerts');

const app = express();
app.use(cors());
app.use('/api', statusRoute);
app.use('/api', roomsRoute);
app.use('/api', usageRoute);
app.use('/api', alertsRoute);

const server = http.createServer(app);
const { broadcast } = attachBroadcaster(server);

evaluate(); // catch any alert conditions already true at startup
startSimulator(() => {
  evaluate();
  broadcast();
});

server.listen(PORT, () => {
  console.log(`Tech-Z backend running at http://localhost:${PORT}/api (WebSocket at ws://localhost:${PORT}/ws)`);
});
