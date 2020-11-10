const articlesRouter = require('express').Router();

const {
  getAllArticles,
  getArticleById,
} = require('../contollers/articlesCTRL.js');
const { send405 } = require('../errors');

articlesRouter.route('/').get(getAllArticles).all(send405);
articlesRouter.route('/:username').get(getArticleById).all(send405);

module.exports = articlesRouter;
