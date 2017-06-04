const app = require('./server');
const request = require('supertest');
const models = require('../models');
const assert = require('assert');
const { EMAIL_REQUIRED, NAME_REQUIRED, PASSWORD_REQUIRED } = require('../lib/strings/strings');


let userId;

describe('User', () => {
  before(done => {
    models.UserTrack.destroy({where: {}})
      .then(() => {
        return models.User.destroy({where: {}});
      }).then(() => {done();});
  });

  it('shouldnot create user without name field', () => {
    return request(app)
      .post('/user')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .expect(400)
      .then(res => {
        assert.equal(res.body.message, NAME_REQUIRED);
      });
  });

  it('shouldnot create user without email field', () => {
    return request(app)
      .post('/user')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({name: 'somename'})
      .expect(400)
      .then(res => {
        assert.equal(res.body.message, EMAIL_REQUIRED);
      });
  });

  it('shouldnot create user with bad format email', () => {
    return request(app)
      .post('/user')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({name: 'somename', email: 'as'})
      .expect(400)
      .then(res => {
        assert.equal(res.body.message, EMAIL_REQUIRED);
      });
  });

  it('shouldnot create user without password field', () => {
    return request(app)
      .post('/user')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({name: 'somename', email: 'email@google.com'})
      .expect(400)
      .then(res => {
        assert.equal(res.body.message, PASSWORD_REQUIRED);
      });
  });

  it('create user with both fields', () => {
    return request(app)
      .post('/user')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({name: 'somename', email: 'email@google.com', password: 'somepassword'})
      .expect(200)
      .then(res => {
        userId = res.body.id;
      });
  });

  it('fetch one user', () => {
    return request(app)
      .get(`/user/${userId}`)
      .expect(200)
      .then(res => {
        assert.equal(res.body.id, userId);
        assert.equal(res.body.email, 'email@google.com');
        assert.equal(res.body.name, 'somename');
      });
  });

  it('do not show passwords in user data', () => {
    return request(app)
      .get(`/user/${userId}`)
      .expect(200)
      .then(res => {
        assert.equal(res.body.password, undefined);
      });
  });

  it('fetch all users', () => {
    return request(app)
      .get('/user')
      .expect(200)
      .then(res => {
        assert.equal(res.body.length, 1);
      });
  });

  describe('Update and delete', () => {
    let token;
    before(done => {
      request(app)
        .post('/auth')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .send({email:'email@google.com', password:'somepassword'})
        .then(res => {
          token = res.body.token;
          done();
        });
    });

    it('require auth for update', () => {
      return request(app)
        .put('/user')
        .expect(401);
    });

    it('require auth for delete', () => {
      return request(app)
        .delete('/user')
        .expect(401);
    });

    it('update user correctly', () => {
      return request(app)
        .put('/user')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `JWT ${token}`)
        .send({email:'emal@google.com'})
        .expect(200)
        .then(res => {
          assert.equal(res.body.email, 'emal@google.com');
        });
    });

    it('delete user correctly', () => {
      return request(app)
        .delete('/user')
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Authorization', `JWT ${token}`)
        .expect(200)
        .then(res => {
          return models.User.findAll();
        })
        .then(userCount => {
          assert.equal(userCount, 0);
        });
    });
  });
});
