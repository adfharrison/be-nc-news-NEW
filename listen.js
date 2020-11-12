const app = require('./app');

const { port = 9090 } = process.env;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
