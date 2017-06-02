const express = require('express');
const router = express.Router();

router.post('/', function(req, res, next) {
  res.json('Create user');
});

router.put('/:id', function(req, res, next) {
  res.json('Update user');
});

router.delete('/:id', function(req, res, next) {
  res.json('Delete user');
});

router.get('/:id', function(req, res, next) {
  res.json('Get user');
});

router.get('/', function(req, res, next) {
  res.json('Get users');
});


module.exports = router;
