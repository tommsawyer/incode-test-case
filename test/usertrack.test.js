const app = require('./server');
const request = require('supertest');
const models = require('../models');
const assert = require('assert');
const { BAD_TRACK_FORMAT, TRACK_HAS_BEEN_DELETED } = require('../lib/strings/strings');
const { createToken } = require('../lib/passport');

describe('UserTrack', () => {
  let token, userId, trackId;

  before(done => {
    models.UserTrack.destroy({where: {}})
      .then(() => {
        return models.User.destroy({where: {}});
      })
      .then(() => {
        return models.User.create({
          name: 'testUser',
          email: 'email@google.com',
          password: 'testPassword',
          profile_photo: 'path_to_profile_photo'
        });
      })
      .then(user => {
        userId = user.id;
        token = createToken(user.id, user.email);
        done();
      });
  });

  it('do not create track without auth', () => {
    return request(app)
      .post('/track')
      .expect(401);
  });

  it('do not create track with bad format track url', () => {
    return request(app)
      .post('/track')
      .set('Authorization', `JWT ${token}`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({track_url: 'badformat'})
      .expect(400)
      .then(res => {
        assert.equal(res.body.message, BAD_TRACK_FORMAT);
      });
  });

  it('create track when all was correct', () => {
    return request(app)
      .post('/track')
      .set('Authorization', `JWT ${token}`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({track_url: 'https://soundcloud.com/someuser/sometrack'})
      .expect(200)
      .then(res => {
        assert.equal(res.body.user_id, userId);
        trackId = res.body.id;
      });
  });

  it('gets track', () => {
    return request(app)
      .get(`/track/${trackId}`)
      .set('Authorization', `JWT ${token}`)
      .expect(200);
  });

  it('gets all tracks without auth', () => {
    return request(app)
      .get('/track')
      .expect(200)
      .then(res => {
        assert.equal(res.body.length, 1);
      });
  });

  it('updates track', () => {
    return request(app)
      .put(`/track/${trackId}`)
      .set('Authorization', `JWT ${token}`)
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({track_url: 'https://soundcloud.com/newuser/sometrack'})
      .expect(200)
      .then(res => {
        assert.equal(res.body.user_id, userId);
        assert.equal(res.body.track_url, 'https://soundcloud.com/newuser/sometrack');
      });
  });

  it('deletes track', () => {
    return request(app)
      .delete(`/track/${trackId}`)
      .set('Authorization', `JWT ${token}`)
      .expect(200)
      .then(res => {
        assert.equal(res.body, TRACK_HAS_BEEN_DELETED);
        return models.UserTrack.findAll();
      })
      .then(trackCount => {
        assert.equal(trackCount, 0);
      });
  });
});
