const HttpServer = require('../http_server/server');
const server = new HttpServer(3000);

server.initializeExpress();
module.exports = server.app;
