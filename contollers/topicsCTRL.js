const { fetchAllTopics, sendNewTopic } = require('../models/topicsMDL');

const getAllTopics = (req, res, next) => {
  fetchAllTopics(req)
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((error) => {
      next(error);
    });
};

const postNewTopic = (req, res, next) => {
  sendNewTopic(req)
    .then((topic) => {
      res.status(201).send(topic);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getAllTopics, postNewTopic };
