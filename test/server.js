const HttpServer = require('../http_server/server');
const winston = require('winston');
winston.level = 'emerg';
const server = new HttpServer(3000);

server.initializeExpress();
module.exports = server.app;
