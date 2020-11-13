const connection = require('../db/data/connections');

const fetchAllTopics = () => {
  return connection
    .select('*')
    .from('topics')
    .then((topicsRows) => {
      return { topics: topicsRows };
    });
};

const sendNewTopic = (req) => {
  topic = req.body.newTopic;
  return connection
    .insert(topic, ['*'])
    .into('topics')
    .then((postedTopic) => {
      return { newTopic: postedTopic[0] };
    });
};

module.exports = { fetchAllTopics, sendNewTopic };
