const express = require('express');
/*const {
  handleInternalErrors,
  handlePSQLErrors,
  handleCustomErrors,
  send404,
} = require('./errors');*/
const app = express();
const apiRouter = require('./routers/apiRouter');

app.use(express.json());
app.use('/api', apiRouter);
/*
app.all('/*', send404);
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);
*/
module.exports = app;
