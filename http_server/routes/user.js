const JSONError = require('../../lib/json_error');
const {
  USER_NOT_FOUND,
  NAME_REQUIRED,
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  USER_HAS_BEEN_DELETED
} = require('../../lib/strings/strings');
const express = require('express');
const router = express.Router();
const models = require('../../models');
const logger = require('winston');
const { needAuth } = require('../../lib/passport');
const emailRegExp = /.+@.+\..+/i;

router.post('/', function(req, res, next) {
  if (!req.body.name) {
    return next(new JSONError(NAME_REQUIRED, 400));
  }

  if (!req.body.email || !emailRegExp.test(req.body.email)) {
    return next(new JSONError(EMAIL_REQUIRED, 400));
  }

  if (!req.body.password) {
    return next(new JSONError(PASSWORD_REQUIRED, 400));
  }

  models.User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  }).then(user => {
    logger.debug('Created user: ' + JSON.stringify(user.dataValues));
    res.json(user.toJSON());
  })
  .catch(next);
});

router.put('/', needAuth(), function(req, res, next) {
  let userConfig = {
    name: req.body.name,
    email: req.body.email
  };

  if (req.body.password) {
    userConfig.password = req.body.password;
  }

  req.user.update(userConfig).then(user => {
    res.json(user);
  }).catch(next);
});

router.delete('/', needAuth(), function(req, res, next) {
  req.user.destroy()
    .then(() => {
      res.json(USER_HAS_BEEN_DELETED);
    })
    .catch(next);
});

router.get('/:id', function(req, res, next) {
  models.User.findById(req.params.id)
    .then(user => {
      if (!user) {
        throw new JSONError(USER_NOT_FOUND, 404);
      }

      res.json(user.toJSON());
    })
    .catch(next);
});

router.get('/', function(req, res, next) {
  models.User.findAll()
    .then(users => {
      res.json(users.map(user => user.toJSON()));
    })
    .catch(next);
});


module.exports = router;
