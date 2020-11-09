const connection = require('../db/data/connections');

const fetchAllTopics = () => {
  return connection
    .select('*')
    .from('topics')
    .then((topicsRows) => {
      return { topics: topicsRows };
    });
};

module.exports = { fetchAllTopics };
