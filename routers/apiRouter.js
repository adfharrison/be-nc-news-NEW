const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');
const commentsRouter = require('./commentsRouter');
const { send405 } = require('../errors');
const { getAllEndpoints } = require('../contollers/apiCTRL');

apiRouter.route('/').get(getAllEndpoints).all(send405);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.get('/home', (req, res, next) => {
  res.status(200).send({ message: 'Welcome to NC NEWS api!' });
});

module.exports = apiRouter;
