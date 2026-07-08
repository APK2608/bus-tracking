const http = require('http');
const app = require('./app');
const { port } = require('./config/env');
const { initSocket } = require('./config/socket');
const { initLocationSocket } = require('./sockets/location.socket');

const server = http.createServer(app);
const io = initSocket(server);
initLocationSocket(io);

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
