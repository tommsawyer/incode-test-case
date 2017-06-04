const JSONError = require('../../lib/json_error');
const {
  USER_NOT_FOUND,
  NAME_REQUIRED,
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED
} = require('../../lib/strings/strings');
const express = require('express');
const router = express.Router();
const models = require('../../models');
const logger = require('winston');
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

router.put('/:id', function(req, res, next) {
  //TODO: update user
  res.json('Update user');
});

router.delete('/:id', function(req, res, next) {
  //TODO: delete user
  res.json('Delete user');
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
