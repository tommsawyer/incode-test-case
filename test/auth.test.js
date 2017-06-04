const app = require('./server');
const request = require('supertest');
const models = require('../models');
const assert = require('assert');
const {
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  USER_NOT_FOUND,
  PASSWORD_NOT_VALID
} = require('../lib/strings/strings');

describe('Auth', () => {
  before(done => {
    models.User.destroy({where: {}, truncate:true})
    .then(() => {
      return models.User.create({
        name: 'testUser',
        email: 'email@google.com',
        password: 'testPassword'
      });
    })
    .then(() => {
      done();
    });
  });

  it('requires email field', () => {
    return request(app)
      .post('/auth')
      .expect(400)
      .then(res => {
        assert.equal(res.body.message, EMAIL_REQUIRED);
      });
  });

  it('requires password field', () => {
    return request(app)
      .post('/auth')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({email: 'email@google.com'})
      .expect(400)
      .then(res => {
        assert.equal(res.body.message, PASSWORD_REQUIRED);
      });
  });

  it('do not auth if user not found', () => {
    return request(app)
      .post('/auth')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({email: 'unexistingemail@google.com', password: 'somepassword'})
      .expect(404)
      .then(res => {
        assert.equal(res.body.message, USER_NOT_FOUND);
      });
  });

  it('do not auth if passwords did not match', () => {
    return request(app)
      .post('/auth')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({email: 'email@google.com', password: 'somepassword'})
      .expect(401)
      .then(res => {
        assert.equal(res.body.message, PASSWORD_NOT_VALID);
      });
  });

  it('fetch token if all was correct', () => {
    return request(app)
      .post('/auth')
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .send({email: 'email@google.com', password: 'testPassword'})
      .expect(200)
      .then(res => {
        assert.notEqual(res.body.token, undefined);
      });
  });
});
