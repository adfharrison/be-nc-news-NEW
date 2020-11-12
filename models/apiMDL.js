const connection = require('../db/data/connections');

const fetchAllEndpoints = (req) => {
  const endpoints = {
    endpoints: {
      '/api': {
        methods: {
          GET: 'get all enpoints in API',
        },
        '/home': {
          methods: {
            GET: 'get welcome message',
          },
        },
        '/topics': {
          methods: {
            GET: 'get all topics',
          },
        },
        '/users': {
          methods: {
            GET: 'get all users',
          },
          '/:username': {
            methods: {
              GET: 'get users by id (/users/integer)',
            },
          },
        },
        '/articles': {
          methods: {
            GET: {
              does: 'get all articles ',
              queries: {
                'sort_by (/articles?sort_by=option)': {
                  default: 'created_at',
                  option1: 'article_id',
                  option2: 'title',
                  option3: 'votes',
                  option4: 'topic',
                  option5: 'author',
                },
                'order (/articles?order=option OR articles?sort_by=option&order=option)': {
                  default: 'asc',
                  option1: 'desc',
                },
              },
            },
            POST: {
              does: 'post a new article',
              requestBody: {
                title: 'this is a new article',
                body: 'the article that is new, is new',

                topic: 'a valid topic',
                author: 'a valid author',
              },
            },
          },
          '/:article_id': {
            methods: {
              GET: 'get article by id (/articles/integer)',
              PATCH: {
                does: 'change article vote count',
                requestBody: { inc_votes: 'integer' },
              },
              DELETE: 'remove article by id (/articles/integer)',
            },
          },
          '/:article_id/comments': {
            methods: {
              GET: {
                does: 'get all comments for that article id ',
                queries: {
                  'sort_by (/articles/integer/comments?sort_by=option)': {
                    default: 'created_at',
                    option1: 'article_id',
                    option2: 'comment_id',
                    option3: 'votes',
                    option4: 'body',
                    option5: 'author',
                  },
                  'order (/articles/integer/comments?order=option OR articles?sort_by=option&order=option)': {
                    default: 'asc',
                    option1: 'desc',
                  },
                },
              },
              POST: {
                does:
                  'add comment to article by id (/articles/integer/comments)',
                requestBody: {
                  username: 'username',
                  body: 'comment body',
                },
              },
            },
          },
        },

        '/comments': {
          methods: {
            GET: 'get all comments',
          },
          '/:comment_id': {
            methods: {
              GET: 'get comment by id (/comments/integer)',
              PATCH: {
                does: 'change comment vote count',
                requestBody: {
                  inc_vote: 'integer',
                },
              },
              DELETE: 'delete comment by id',
            },
          },
        },
      },
    },
  };

  return endpoints;
};

module.exports = { fetchAllEndpoints };
