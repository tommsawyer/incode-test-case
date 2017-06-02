const app = require('./server');
const request = require('supertest');
const models = require('../models');

before(done => {
  models.User.drop().then(() => done());
});

describe('User', () => {
  it('should create user', (done) => {
    request(app)
      .post('/user')
      .expect(res => {
        console.log(res.body);
      })
      .expect(200, done);
  });
});
