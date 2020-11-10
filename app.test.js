process.env.NODE_ENV = 'test';

const app = require('./app');
const request = require('supertest');
const connection = require('./db/data/connections');

describe('/api', () => {
  afterAll(() => {
    return connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  describe('/api - errors', () => {
    test('404 missing api/ endpoint', () => {
      return request(app)
        .get('/api/iamnothere')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Route Not Found');
        });
    });
  });

  describe('api/topics', () => {
    test('GET status 200 and array of topics', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({ topics: expect.any(Array) });
        });
    });
    describe('api/topics - errors ', () => {
      test('405 invalid methods topics method', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method Not Allowed');
            });
        });
        return Promise.all(requestPromises);
      });
    });
  });
  describe('api/users', () => {
    test('GET status 200 and array of users', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({ users: expect.any(Array) });
        });
    });
    describe('api/users/:username', () => {
      test('GET status 200 and single user', () => {
        return request(app)
          .get('/api/users/butter_bridge')
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual({
              requestedUser: {
                avatar_url:
                  'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
                name: 'jonny',
                username: 'butter_bridge',
              },
            });
          });
      });
    });

    describe('api/users - errors ', () => {
      test('405 invalid methods /users method', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/users')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method Not Allowed');
            });
        });
        return Promise.all(requestPromises);
      });
      test('405 invalid methods /users/:username method', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/users/:username')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method Not Allowed');
            });
        });
        return Promise.all(requestPromises);
      });
      test('404 invalid username /users/:username ', () => {
        return request(app)
          .get('/api/users/iamnothere')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Route Not Found');
          });
      });
    });
  });
});
