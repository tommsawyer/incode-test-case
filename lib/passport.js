const jwt           = require('jsonwebtoken');
const passport      = require('passport');
const passportJWT   = require('passport-jwt');
const ConfigManager = require('./config_manager');
const models        = require('../models');
const ExtractJwt    = passportJWT.ExtractJwt;
const JwtStrategy   = passportJWT.Strategy;

const createToken = function(id, email) {
  const payload = { id, email };
  const token = jwt.sign(payload, ConfigManager.server.secretKey);

  return token;
};

const jwtOptions = {
  secretOrKey: ConfigManager.server.secretKey,
  jwtFromRequest: ExtractJwt.fromAuthHeader()
};

const strategy = new JwtStrategy(jwtOptions, (payload, next) => {
  models.User.findById(payload.id)
    .then(user => {
      if (user) {
        return next(null, user);
      } else {
        return next(null, false);
      }
    })
    .catch(next);
});

passport.use(strategy);

module.exports = {
  passport,
  createToken
};

