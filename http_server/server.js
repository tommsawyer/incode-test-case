const express            = require('express');
const JSONError          = require('../lib/json_error');
const { PATH_NOT_FOUND } = require('../lib/strings/strings');
const logger             = require('winston');

const PATH_TO_STATIC_CONTENT = __dirname + '/../public';

class HttpServer {
  constructor(port) {
    this.port = port;
    this.app = express();
  }

  initializeExpress() {
    this.app.use(express.static(PATH_TO_STATIC_CONTENT));
    this.app.use(this._initRequestMiddleware.bind(this));
    this.app.use(this._notFoundMiddleware.bind(this));
    this.app.use(this._errorHandlerMiddleware.bind(this));
  }

  run() {
    this.initializeExpress();

    return new Promise((resolve, reject) => {
      this.app.listen(this.port, function(err) {
        if (err) {
          return reject(err);
        }

        resolve(this);
      });
    });
  }

  _notFoundMiddleware(req, res, next) {
    const errorMessage = `${PATH_NOT_FOUND}: ${req.method} ${req.url}`;
    const jsonError = new JSONError(errorMessage, 404);

    next(jsonError);
  }

  _errorHandlerMiddleware(err, req, res, next) {
    if (!(err instanceof JSONError)) {
      err = new JSONError();
    }

    const errorMessage = err.toClient();
    logger.error(errorMessage);
    res.status(err.code).end(errorMessage);
  }

  _initRequestMiddleware(req, res, next) {
    logger.info(`${req.method} -- ${req.url}`);
    this._setHeaders(res);

    next();
  }

  _setHeaders(response) {
    response.header('Access-Control-Allow-Origin', '*');
    response.set({ 'content-type': 'application/json; charset=utf-8' });
  }
}

module.exports = HttpServer;
