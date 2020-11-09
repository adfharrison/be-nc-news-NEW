const { fetchAllTopics } = require('../models/topicsMDL');

const getAllTopics = (req, res, next) => {
  fetchAllTopics(req)
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getAllTopics };
