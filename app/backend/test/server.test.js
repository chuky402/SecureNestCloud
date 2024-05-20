// app/backend/test/server.test.js
const request = require('supertest');
const app = require('../src/server');

describe('GET /', function() {
  it('responds with Hello, SecureNest Cloud!', function(done) {
    request(app)
      .get('/')
      .expect(200, 'Hello, SecureNest Cloud!', done);
  });
});
