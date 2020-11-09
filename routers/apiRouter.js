const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter');

apiRouter.use('/topics', topicsRouter);
apiRouter.get('/home', (req, res, next) => {
  res.status(200).send({ message: 'Welcome to NC NEWS api!' });
});

module.exports = apiRouter;
