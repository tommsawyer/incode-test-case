const HttpServer = require('./http_server/server');
const ConfigManager = require('./lib/config_manager');
const logger = require('winston');

const server = new HttpServer(ConfigManager.server.port);

server.run()
  .then(() => {
    logger.info('App is running on ' + ConfigManager.server.port);
  });
