const commentsRouter = require('express').Router();

const {
  patchCommentById,
  getCommentById,
  getAllComments,
  deleteCommentById,
} = require('../contollers/commentsCTRL.js');
const { send405 } = require('../errors');

commentsRouter.route('/').get(getAllComments).all(send405);
commentsRouter
  .route('/:comment_id')
  .get(getCommentById)
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(send405);

module.exports = commentsRouter;
