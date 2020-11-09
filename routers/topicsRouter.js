const topicsRouter = require('express').Router();

const { getAllTopics } = require('../contollers/topicsCTRL.js');
const { send405 } = require('../errors');

topicsRouter.route('/').get(getAllTopics).all(send405);

module.exports = topicsRouter;
