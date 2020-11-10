const { fetchCommentsByArticleId } = require('../models/commentsMDL');

const getCommentsByArticleId = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  fetchCommentsByArticleId(req, sort_by, order)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { getCommentsByArticleId };
