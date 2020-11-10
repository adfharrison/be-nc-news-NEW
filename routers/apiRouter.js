const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');
const usersRouter = require('./usersRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.get('/home', (req, res, next) => {
  res.status(200).send({ message: 'Welcome to NC NEWS api!' });
});

module.exports = apiRouter;
