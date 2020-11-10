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
              user: {
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
            expect(body.msg).toBe('User Not Found');
          });
      });
    });
  });
  describe('api/articles', () => {
    test('GET status 200 and array of articles', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({ articles: expect.any(Array) });
        });
    });

    describe('api/articles/:article_id', () => {
      test('GET status 200 and single article', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual({
              article: {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                votes: 100,
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2018-11-15T12:21:54.171Z',
                comment_count: 13,
              },
            });
          });
      });

      test('PATCH status 201 increment vote return updated article', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(201)
          .then((response) => {
            expect(response.body).toEqual({
              article: {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                votes: 101,
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2018-11-15T12:21:54.171Z',
                comment_count: 13,
              },
            });
          });
      });
      test('PATCH status 201 decrement vote return updated article', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -1 })
          .expect(201)
          .then((response) => {
            expect(response.body).toEqual({
              article: {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                votes: 99,
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2018-11-15T12:21:54.171Z',
                comment_count: 13,
              },
            });
          });
      });
      test('PATCH status 201 zero input doesnt change vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 0 })
          .expect(201)
          .then((response) => {
            expect(response.body).toEqual({
              article: {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                votes: 100,
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2018-11-15T12:21:54.171Z',
                comment_count: 13,
              },
            });
          });
      });
      test('PATCH status 201 undefined input doesnt change vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: undefined })
          .expect(201)
          .then((response) => {
            expect(response.body).toEqual({
              article: {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                body: 'I find this existence challenging',
                votes: 100,
                topic: 'mitch',
                author: 'butter_bridge',
                created_at: '2018-11-15T12:21:54.171Z',
                comment_count: 13,
              },
            });
          });
      });
      // ********* HERE IS WHERE I WAS UP TO, NEXT IS QUERIES ON GET ARTICLES - FIX MODEL
      test('DELETE status 204 returns "articles deleted: 1" ', () => {
        return request(app)
          .delete('/api/articles/1')
          .expect(204)
          .then((res) => {
            expect(res.body).toBe({ msg: 'Comments deleted: 1' });
          })
          .then(() => {
            return request(app)
              .get(api / articles)
              .then((res) => {
                expect(res.body.articles.length).toBe(11);
              });
          });
      });
    });
    describe('api/articles/:articles_id/comments', () => {
      test('GET status 200 and all comments for single article', () => {
        return request(app)
          .get('/api/articles/5/comments')
          .expect(200)
          .then((response) => {
            expect(response.body).toEqual([
              {
                comment_id: 14,
                votes: 16,
                created_at: '2004-11-25T12:36:03.389Z',
                author: 'icellusedkars',
                body:
                  'What do you see? I have no idea where this will lead us. This place I speak of, is known as the Black Lodge.',
              },
              {
                comment_id: 15,
                votes: 1,
                created_at: '2003-11-26T12:36:03.389Z',
                author: 'butter_bridge',
                body: "I am 100% sure that we're not completely sure.",
              },
            ]);
          });
      });
      test('GET status 200 - returns comments sorted by created_at default', () => {
        return request(app)
          .get('/api/articles/5/comments')
          .expect(200)
          .then((response) => {
            expect(response.body).toBeSortedBy('created_at', {
              descending: true,
            });
          });
      });
      test('GET status 200 - return comments sorted by specified query', () => {
        return request(app)
          .get('/api/articles/5/comments?sort_by=votes')
          .expect(200)
          .then((response) => {
            expect(response.body).toBeSortedBy('votes', {
              descending: true,
            });
          });
      });
      test('GET status 200 - return comments sorted by specified query AND order', () => {
        return request(app)
          .get('/api/articles/5/comments?sort_by=author&order=asc')
          .expect(200)
          .then((response) => {
            expect(response.body).toBeSortedBy('author', {
              descending: false,
            });
          });
      });
      test('GET status 200 - return comments sorted by timestamp', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=created_at&order=asc')
          .expect(200)
          .then((response) => {
            expect(response.body).toBeSortedBy('created_at', {
              descending: false,
            });
          });
      });
    });
    describe('api/articles - errors ', () => {
      test('405 invalid methods articles method', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/articles')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method Not Allowed');
            });
        });
        return Promise.all(requestPromises);
      });
      test('GET 404 invalid article_id /articles/:article_id ', () => {
        return request(app)
          .get('/api/articles/99999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Article Not Found');
          });
      });
      test('GET 400 bad request /articles/:article_id ', () => {
        return request(app)
          .get('/api/articles/chips')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
      });
      test('405 invalid methods /articles/:article_id method', () => {
        const invalidMethods = ['put'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/articles/:article_id')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method Not Allowed');
            });
        });
        return Promise.all(requestPromises);
      });
      test('PATCH 404 invalid article_id /articles/:article_id ', () => {
        return request(app)
          .patch('/api/articles/99999')
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Article Not Found');
          });
      });
      test('PATCH 400 bad request /articles/:article_id ', () => {
        return request(app)
          .patch('/api/articles/chips')
          .send({ inc_votes: undefined })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
      });
      test(' Query 400 Error - /articles/:article_id/comments - SortBy', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=notAcolumn')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
      });
    });
  });
});
