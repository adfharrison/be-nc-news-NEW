const articlesRouter = require('express').Router();

const {
  getAllArticles,
  getArticleById,
  patchArticle,
  deleteArticleById,
  postArticle,
} = require('../contollers/articlesCTRL.js');

const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require('../contollers/commentsCTRL');
const { send405 } = require('../errors');

articlesRouter.route('/').get(getAllArticles).post(postArticle).all(send405);
articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticle)
  .delete(deleteArticleById)
  .all(send405);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId)
  .all(send405);
module.exports = articlesRouter;
