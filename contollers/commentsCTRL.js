const {
  fetchCommentsByArticleId,
  sendComment,
  editComment,
  fetchCommentById,
  fetchAllComments,
  removeCommentById,
} = require('../models/commentsMDL');

const getAllComments = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  fetchAllComments(req, sort_by, order)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((error) => {
      next(error);
    });
};
const getCommentsByArticleId = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  const limit = req.query.limit;
  const page = req.query.p;
  fetchCommentsByArticleId(req, sort_by, order, limit, page)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((error) => {
      next(error);
    });
};

const postCommentByArticleId = (req, res, next) => {
  sendComment(req)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((error) => {
      next(error);
    });
};

const getCommentById = (req, res, next) => {
  fetchCommentById(req)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};
const patchCommentById = (req, res, next) => {
  editComment(req)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};

const deleteCommentById = (req, res, next) => {
  removeCommentById(req)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      next(error);
    });
};
module.exports = {
  patchCommentById,
  getCommentsByArticleId,
  postCommentByArticleId,
  getCommentById,
  getAllComments,
  deleteCommentById,
};
