const send404 = (req, res, next) => {
  res.status(404).send({ msg: 'Route Not Found' });
};

const send405 = (req, res, next) => {
  res.status(405).send({ msg: 'Method Not Allowed' });
};

const handlePSQLErrors = (err, req, res, next) => {
  console.log(err.code, '<<<<<err code');
  const badReqCodes = ['22P02', '42703'];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: 'Bad Request' });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleInternalErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: 'Server error!' });
};

module.exports = {
  send404,
  handleInternalErrors,
  handlePSQLErrors,
  handleCustomErrors,
  send405,
};
