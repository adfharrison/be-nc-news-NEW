const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');
const articlesRouter = require('./articlesRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.get('/home', (req, res, next) => {
  res.status(200).send({ message: 'Welcome to NC NEWS api!' });
});

module.exports = apiRouter;
