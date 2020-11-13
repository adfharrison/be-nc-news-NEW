process.env.NODE_ENV = 'test';

const app = require('./app');
const request = require('supertest');
const connection = require('./db/data/connections');
const { convertTimeStamp } = require('./db/utils/data-manipulation');
const { get } = require('./routers/apiRouter');

describe('/api', () => {
  afterAll(() => {
    return connection.destroy();
  });
  beforeEach(() => {
    return connection.seed.run();
  });
  // HERE IS THE PLACE THAT THE THING THAT WILL BREAK EVERYTHING IS
  //beforeEach(() => {
  // Date.now = jest.fn(() => 1605052800000); // 2020-11-11T00:00Z0 (GMT)
  //});

  test('/api returns a json of all endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ endpoints: expect.any(Object) });
      });
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

    test('POST status 201 and can create new topic. returns new topic', () => {
      return request(app)
        .post('/api/topics')
        .send({
          newTopic: {
            description: 'This is a new topic',
            slug: 'new',
          },
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual({
            newTopic: {
              description: 'This is a new topic',
              slug: 'new',
            },
          });
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
      test(' 400 bad POST request Error - incorrect req.body', () => {
        return request(app)
          .post('/api/topics')
          .send({
            newTopic: {
              description: 'new_user',
            },
          })

          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
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

    test('POST status 201 can post a new user', () => {
      return request(app)
        .post('/api/users')
        .send({
          newUser: {
            username: 'new_user',
            name: 'this is their name',
            avatar_url: 'https://avatar_url.com',
          },
        })
        .expect(201)
        .then((response) => {
          expect(response.body).toEqual({
            newUser: {
              username: 'new_user',
              name: 'this is their name',
              avatar_url: 'https://avatar_url.com',
            },
          });
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
        const invalidMethods = ['put', 'delete'];
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
      test(' 400 bad POST request Error - incorrect req.body', () => {
        return request(app)
          .post('/api/users')
          .send({
            newUser: {
              username: 'new_user',
            },
          })

          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
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
    test('GET status 200 and array of articles, with total count', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            articles: expect.any(Array),
            total_count: 12,
          });
        });
    });
    test('GET status 200 all articles should have a comment_count key', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
          const allHaveCommentCount = response.body.articles.every(
            (article) => {
              return article.hasOwnProperty('comment_count');
            }
          );
          expect(allHaveCommentCount).toBe(true);
        });
    });

    test('GET status 200 - return articles sorted by date by default', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy('created_at', {
            descending: true,
          });
        });
    });
    test('GET 200 returns articles sorted by...', () => {
      const validQueries = ['article_id', 'title', 'topic', 'author'];
      const requestPromises = validQueries.map((validQuery) => {
        return request(app)
          .get(`/api/articles?sort_by=${validQuery}`)
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toBeSortedBy(validQuery, {
              descending: false,
            });
          });
      });
      return Promise.all(requestPromises);
    });
    test('GET status 200 - can order by ascending ', () => {
      return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy('created_at', {
            descending: false,
          });
        });
    });
    test('GET status 200 - can order by column + ascending ', () => {
      return request(app)
        .get('/api/articles?sort_by=author&order=asc')
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toBeSortedBy('author', {
            descending: false,
          });
        });
    });
    test('GET status 200 -article limit defaults to 10, retains total_count', () => {
      return request(app)
        .get('/api/articles?limit=10')
        .expect(200)
        .then((response) => {
          expect(response.body.articles.length).toBe(10);
          expect(response.body.total_count).toBe(12);
        });
    });
    test('GET status 200 - can set article limit, retains total_count', () => {
      return request(app)
        .get('/api/articles?limit=5')
        .expect(200)
        .then((response) => {
          expect(response.body.articles.length).toBe(5);
          expect(response.body.total_count).toBe(12);
        });
    });

    test('GET status 200 - can set pages based on limit', () => {
      return request(app)
        .get('/api/articles?limit=2&p=2')
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toEqual([
            {
              article_id: 3,
              author: 'icellusedkars',
              body: 'some gifs',
              comment_count: '0',
              created_at: '2010-11-17T12:21:54.171Z',
              title: 'Eight pug gifs that remind me of mitch',
              topic: 'mitch',
              votes: 0,
            },
            {
              article_id: 4,
              author: 'rogersop',
              comment_count: '0',
              body:
                'We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages',
              created_at: '2006-11-18T12:21:54.171Z',
              title: 'Student SUES Mitch!',
              topic: 'mitch',
              votes: 0,
            },
          ]);
        });
    });
    test('GET status 200 - can set pages without user defined limit', () => {
      return request(app)
        .get('/api/articles?p=2')
        .expect(200)
        .then((response) => {
          expect(response.body.articles).toEqual([
            {
              article_id: 11,
              author: 'icellusedkars',
              comment_count: '0',
              body:
                'Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?',
              created_at: '1978-11-25T12:21:54.171Z',
              title: 'Am I a cat?',
              topic: 'mitch',
              votes: 0,
            },
            {
              article_id: 12,
              author: 'butter_bridge',
              comment_count: '0',
              body: 'Have you seen the size of that thing?',
              created_at: '1974-11-26T12:21:54.171Z',
              title: 'Moustache',
              topic: 'mitch',
              votes: 0,
            },
          ]);
        });
    });

    test('GET status 200 can return articles filters by author, ', () => {
      return request(app)
        .get('/api/articles?author=butter_bridge')
        .then((response) => {
          const allBySameAuthor = response.body.articles.every((article) => {
            return article.author === 'butter_bridge';
          });
          expect(allBySameAuthor).toBe(true);
        });
    });

    test('POST status 201 can post new article', () => {
      return request(app)
        .post('/api/articles')
        .send({
          newArticle: {
            title: 'this is a new article',
            body: 'the article that is new, is new',
            votes: 12,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: '2018-11-15T12:21:54.171Z',
          },
        })
        .expect(201)
        .then((response) => {
          expect(response.body.newArticle).toEqual({
            article_id: 13,
            title: 'this is a new article',
            body: 'the article that is new, is new',
            votes: 12,
            topic: 'mitch',
            author: 'butter_bridge',
            created_at: '2018-11-15T12:21:54.171Z',
          });
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

      test('PATCH status 200 increment vote return updated article', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 1 })
          .expect(200)
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
      test('PATCH status 200 decrement vote return updated article', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -1 })
          .expect(200)
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
      test('PATCH status 200 zero input doesnt change vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 0 })
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
      test('PATCH status 200 undefined input doesnt change vote count', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: undefined })
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

      test('DELETE status 204 - deletes article', () => {
        return request(app)
          .delete('/api/articles/1')
          .expect(204)
          .then(() => {
            return request(app)
              .get('/api/articles?limit=12')
              .then((res) => {
                expect(res.body.articles.length).toBe(11);
              });
          });
      });
      test('DELETE status 204 - also deletes associated comments', () => {
        return request(app)
          .delete('/api/articles/5')
          .expect(204)
          .then(() => {
            return request(app)
              .get('/api/articles/5/comments')
              .expect(404)
              .then(({ body }) => {
                expect(body.msg).toBe('Article Not Found');
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
            expect(response.body.comments).toEqual([
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
            expect(response.body.comments).toBeSortedBy('created_at', {
              descending: true,
            });
          });
      });

      test('GET status 200 - if article exists but has no comments, still returns  but empty', () => {
        return request(app)
          .get('/api/articles/7/comments')
          .expect(200)
          .then((response) => {
            console.log(response.body.comments);
            expect(response.body.comments.length).toBe(0);
            expect(response.body.total_count).toBe(
              'No comments for this article'
            );
          });
      });
      test('GET status 200 - return comments sorted by specified query', () => {
        return request(app)
          .get('/api/articles/5/comments?sort_by=votes')
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toBeSortedBy('votes', {
              descending: true,
            });
          });
      });
      test('GET status 200 - return comments sorted by specified query AND order', () => {
        return request(app)
          .get('/api/articles/5/comments?sort_by=author&order=asc')
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toBeSortedBy('author', {
              descending: false,
            });
          });
      });
      test('GET status 200 - return comments sorted by timestamp', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=created_at&order=asc')
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toBeSortedBy('created_at', {
              descending: false,
            });
          });
      });
      test('POST status 201 - posts comment and returns posted comment', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            newComment: {
              username: 'butter_bridge',
              body: 'i am a new comment body',
            },
          })
          .expect(201)
          .then((response) => {
            //const timeNow = convertTimeStamp(Date.now());

            expect(response.body.newComment).toHaveProperty('article_id');
            expect(response.body.newComment).toHaveProperty('body');
            expect(response.body.newComment).toHaveProperty('votes');
            expect(response.body.newComment).toHaveProperty('comment_id');
            expect(response.body.newComment).toHaveProperty('created_at');
            expect(response.body.newComment).toHaveProperty('author');
          });
      });
      test('GET status 200 -comment limit defaults to 10, retains total_count', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=10')
          .expect(200)
          .then((response) => {
            expect(response.body.comments.length).toBe(10);
            expect(response.body.total_count).toBe(13);
          });
      });
      test('GET status 200 - can set comment limit, retains total_count', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=5')
          .expect(200)
          .then((response) => {
            expect(response.body.comments.length).toBe(5);
            expect(response.body.total_count).toBe(13);
          });
      });
      test('GET status 200 - can set pages based on limit', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=2&p=2')
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toEqual([
              {
                comment_id: 4,
                author: 'icellusedkars',
                body:
                  ' I carry a log — yes. Is it funny to you? It is not to me.',
                created_at: '2014-11-23T12:36:03.389Z',

                votes: -100,
              },
              {
                comment_id: 5,
                author: 'icellusedkars',
                body: 'I hate streaming noses',
                created_at: '2013-11-23T12:36:03.389Z',

                votes: 0,
              },
            ]);
          });
      });
      test('GET status 200 - can set pages without user defined limit', () => {
        return request(app)
          .get('/api/articles/1/comments?p=2')
          .expect(200)
          .then((response) => {
            expect(response.body.comments).toEqual([
              {
                comment_id: 12,
                author: 'icellusedkars',
                body: 'Massive intercranial brain haemorrhage',
                created_at: '2006-11-25T12:36:03.389Z',

                votes: 0,
              },
              {
                comment_id: 13,
                author: 'icellusedkars',
                body: 'Fruit pastilles',
                created_at: '2005-11-25T12:36:03.389Z',

                votes: 0,
              },
              {
                comment_id: 18,
                author: 'butter_bridge',
                body: 'This morning, I showered for nine minutes.',
                created_at: '2000-11-26T12:36:03.389Z',

                votes: 16,
              },
            ]);
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
      test('400 bad request /articles?limit negative number', () => {
        return request(app)
          .get('/api/articles?limit=-2')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
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
      test('DELETE 404 invalid article_id /articles/:article_id ', () => {
        return request(app)
          .delete('/api/articles/99999')

          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Article Not Found');
          });
      });
      test('DELETE 400 bad request /articles/:article_id ', () => {
        return request(app)
          .delete('/api/articles/chips')

          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
      });
      test('POST 400 bad request /articles - incorrect post format ', () => {
        return request(app)
          .post('/api/articles')
          .send({
            newArticle: {
              notAKey: 'this is a new article',
              notAKeyEither: 'the article that is new, is new',
              votes: 12,
              topic: 'mitch',
              author: 'butter_bridge',
              created_at: '2018-11-15T12:21:54.171Z',
            },
          })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
      });
      test;

      test('GET 404 invalid article_id /articles/:article_id/comments ', () => {
        return request(app)
          .get('/api/articles/99999/comments')

          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Article Not Found');
          });
      });
      test('POST 400 bad request /articles/article_id/comments - incorrect post format ', () => {
        return request(app)
          .post('/api/articles/1/comments')
          .send({
            newComment: {
              notAKey: 'this is a new article',
              notAKeyEither: 'the article that is new, is new',
              votes: 12,
              topic: 'mitch',
              author: 'butter_bridge',
              created_at: '2018-11-15T12:21:54.171Z',
            },
          })
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

      test(' Query 400 Error - /articles/- SortBy', () => {
        return request(app)
          .get('/api/articles/?sort_by=notAcolumn')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
      });
    });
  });
  describe('api/comments', () => {
    test('GET status 200 and array of comments', () => {
      return request(app)
        .get('/api/comments')
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({ comments: expect.any(Array) });
        });
    });
    describe('api/comments/comment_id', () => {
      test('GET status 200 and single comment', () => {
        return request(app)
          .get('/api/comments/1')
          .expect(200)
          .then((response) => {
            //const timeNow = convertTimeStamp(Date.now());

            expect(response.body.comment).toHaveProperty('article_id');
            expect(response.body.comment).toHaveProperty('body');
            expect(response.body.comment).toHaveProperty('votes');
            expect(response.body.comment).toHaveProperty('comment_id');
            expect(response.body.comment).toHaveProperty('created_at');
            expect(response.body.comment).toHaveProperty('author');
          });
      });
      test('PATCH status 200 increment vote return updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 1 })
          .expect(200)
          .then((response) => {
            expect(response.body.comment).toEqual({
              comment_id: 1,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 17,
              author: 'butter_bridge',
              article_id: 9,
              created_at: '2017-11-22T12:36:03.389Z',
            });
          });
      });
      test('PATCH status 200 decrement vote return updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: -1 })
          .expect(200)
          .then((response) => {
            expect(response.body.comment).toEqual({
              comment_id: 1,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 15,
              author: 'butter_bridge',
              article_id: 9,
              created_at: '2017-11-22T12:36:03.389Z',
            });
          });
      });
      test('PATCH status 200 zero vote doesnt change vote count', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 0 })
          .expect(200)
          .then((response) => {
            expect(response.body.comment).toEqual({
              comment_id: 1,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 16,
              author: 'butter_bridge',
              article_id: 9,
              created_at: '2017-11-22T12:36:03.389Z',
            });
          });
      });
      test('PATCH status 200 undefined vote doesnt change vote count', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: undefined })
          .expect(200)
          .then((response) => {
            expect(response.body.comment).toEqual({
              comment_id: 1,
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
              votes: 16,
              author: 'butter_bridge',
              article_id: 9,
              created_at: '2017-11-22T12:36:03.389Z',
            });
          });
      });
      test('DELETE status 204 - deletes comment', () => {
        return request(app)
          .delete('/api/comments/1')
          .expect(204)
          .then(() => {
            return request(app)
              .get('/api/comments')
              .then((res) => {
                expect(res.body.comments.length).toBe(17);
              });
          });
      });
    });
    describe('api/comments - errors', () => {
      test('405 invalid methods /comments method', () => {
        const invalidMethods = ['put', 'patch', 'delete', 'post'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/comments')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method Not Allowed');
            });
        });
        return Promise.all(requestPromises);
      });
      test('405 invalid methods /comments/:comment_id method', () => {
        const invalidMethods = ['put', 'post'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/comments/1')
            .expect(405)
            .then(({ body }) => {
              expect(body.msg).toBe('Method Not Allowed');
            });
        });
        return Promise.all(requestPromises);
      });
      test('GET 404 invalid comment_id /comments/:comment_id ', () => {
        return request(app)
          .get('/api/comments/99999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Comment Not Found');
          });
      });
      test('GET 400 bad request /comments/:comment_id ', () => {
        return request(app)
          .get('/api/comments/chips')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
      });
      test('PATCH 404 invalid comment_id /comments/:comment_id ', () => {
        return request(app)
          .patch('/api/comments/99999')
          .send({ inc_votes: 1 })
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Comment Not Found');
          });
      });
      test('PATCH 400 bad request/comments/:comment_id ', () => {
        return request(app)
          .patch('/api/comments/chips')
          .send({ inc_votes: undefined })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad Request');
          });
      });

      test('DELETE 404 invalid comment_id /comments/:comment_id ', () => {
        return request(app)
          .delete('/api/comments/99999')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Comment Not Found');
          });
      });
    });
  });
});
