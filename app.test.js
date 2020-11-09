process.env.NODE_ENV = 'test';

const app = require('./app');
const request = require('supertest');
const connection = require('./db/data/connections');

describe('/api', () => {
  afterAll(() => {
    return connection.destroy();
  });

  describe('/topics', () => {
    test('GET status 200 and array of topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({ topics: expect.any(Array) });
        });
    });
  });
});
