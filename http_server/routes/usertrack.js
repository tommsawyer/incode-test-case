const express = require('express');
const router = express.Router();
const models = require('../../models');
const JSONError = require('../../lib/json_error');
const {
  BAD_TRACK_FORMAT,
  TRACK_NOT_FOUND,
  ACCESS_DENIEDED,
  TRACK_HAS_BEEN_DELETED
} = require('../../lib/strings/strings');

const { needAuth } = require('../../lib/passport');

router.post('/', needAuth(), function(req, res, next) {
  const soundCloudRegExp = /https:\/\/soundcloud.com\/.*\/.*/;

  if (!req.body.track_url || !soundCloudRegExp.test(req.body.track_url)) {
    return next(new JSONError(BAD_TRACK_FORMAT, 400));
  }

  models.UserTrack.create({
    user_id: req.user.id,
    track_url: req.body.track_url
  }).then(track => {
    res.json(track.toJSON());
  }).catch(next);
});

router.get('/:id', function(req, res, next) {
  models.UserTrack.findById(req.params.id)
  .then(track => {
    if (!track) {
      throw new JSONError(TRACK_NOT_FOUND, 404);
    }

    res.json(track.toJSON());
  }).catch(next);
});

router.get('/', function(req, res, next) {
  models.UserTrack.findAll()
  .then(tracks => {
    res.json(tracks.map(track => track.toJSON()));
  }).catch(next);
});

router.delete('/:id', needAuth(), function(req, res, next) {
  models.UserTrack.findById(req.params.id)
    .then(track => {
      if (!track) {
        throw new JSONError(TRACK_NOT_FOUND, 404);
      }

      if (track.user_id !== req.user.id) {
        throw new JSONError(ACCESS_DENIEDED, 401);
      }

      return track.destroy();
    })
    .then(() => {
      res.json(TRACK_HAS_BEEN_DELETED);
    }).catch(next);
});

router.put('/:id', needAuth(), function(req, res, next) {
  models.UserTrack.findById(req.params.id)
    .then(track => {
      if (!track) {
        throw new JSONError(TRACK_NOT_FOUND, 404);
      }

      if (track.user_id !== req.user.id) {
        throw new JSONError(ACCESS_DENIEDED, 401);
      }

      return track.update({track_url: req.body.track_url});
    })
    .then(track => {
      res.json(track.toJSON());
    }).catch(next);
});

module.exports = router;
