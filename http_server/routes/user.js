const JSONError = require('../../lib/json_error');
const { USER_NOT_FOUND } = require('../../lib/strings/strings');
const express = require('express');
const router = express.Router();
const models = require('../../models');
const logger = require('winston');

router.post('/', function(req, res, next) {
  models.User.create({
    name: req.body.name,
    email: req.body.email
  }).then(user => {
    logger.debug('Created user: ' + JSON.stringify(user.dataValues));
    res.json(user.dataValues);
  })
  .catch(next);
});

router.put('/:id', function(req, res, next) {
  res.json('Update user');
});

router.delete('/:id', function(req, res, next) {
  res.json('Delete user');
});

router.get('/:id', function(req, res, next) {
  models.User.findById(req.params.id)
    .then(user => {
      if (!user) {
        throw new JSONError(USER_NOT_FOUND, 404);
      }

      res.json(user.dataValues);
    })
    .catch(next);
});

router.get('/', function(req, res, next) {
  models.User.findAll()
    .then(users => {
      res.json(users.map(user => user.dataValues));
    })
    .catch(next);
});


module.exports = router;
