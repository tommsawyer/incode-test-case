const express = require('express');
const router = express.Router();
const models = require('../../models');
const JSONError = require('../../lib/json_error');
const {
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  USER_NOT_FOUND,
  PASSWORD_NOT_VALID
} = require('../../lib/strings/strings');
const { createToken } = require('../../lib/passport');

router.post('/', function(req, res, next) {
  if (!req.body.email) {
    return next(new JSONError(EMAIL_REQUIRED, 400));
  }

  if (!req.body.password) {
    return next(new JSONError(PASSWORD_REQUIRED, 400));
  }

  models.User.findOne({ where: {email: req.body.email}})
    .then(user => {
      if (!user) {
        throw new JSONError(USER_NOT_FOUND, 404);
      }

      if (!user.isValidPassword(req.body.password)) {
        throw new JSONError(PASSWORD_NOT_VALID, 401);
      }

      const token = createToken(user.id, user.email);
      res.json({ token });
    })
    .catch(next);
});

module.exports = router;
