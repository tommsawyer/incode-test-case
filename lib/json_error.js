const { INTERNAL_SERVER_ERROR } = require('./strings/strings');

class JSONError extends Error {
  constructor(message, code) {
    super();
    this.message = message || INTERNAL_SERVER_ERROR;
    this.code = code || 500;
  }

  toClient() {
    return JSON.stringify({
      type: 'error',
      message: this.message
    });
  }
}

module.exports = JSONError;
