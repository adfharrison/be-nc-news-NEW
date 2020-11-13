const topicsRouter = require('express').Router();

const { getAllTopics, postNewTopic } = require('../contollers/topicsCTRL.js');
const { send405 } = require('../errors');

topicsRouter.route('/').get(getAllTopics).post(postNewTopic).all(send405);

module.exports = topicsRouter;
