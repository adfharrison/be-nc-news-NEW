const articlesRouter = require('express').Router();

const {
  getAllArticles,
  getArticleById,
  patchArticle,
  deleteArticleById,
} = require('../contollers/articlesCTRL.js');

const { getCommentsByArticleId } = require('../contollers/commentsCTRL');
const { send405 } = require('../errors');

articlesRouter.route('/').get(getAllArticles).all(send405);
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticleById)
  .all(send405);

articlesRouter.route('/:article_id/comments').get(getCommentsByArticleId);
module.exports = articlesRouter;