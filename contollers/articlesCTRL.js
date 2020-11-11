const {
  fetchAllArticles,
  fetchArticleById,
  editArticle,
  removeArticle,
  sendArticle,
} = require('../models/articlesMDL');

const getAllArticles = (req, res, next) => {
  const sort_by = req.query.sort_by;
  const order = req.query.order;
  fetchAllArticles(req, sort_by, order)
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((error) => {
      next(error);
    });
};

const postArticle = (req, res, next) => {
  sendArticle(req)
    .then((article) => {
      res.status(201).send(article);
    })
    .catch((error) => {
      next(error);
    });
};

const getArticleById = (req, res, next) => {
  fetchArticleById(req)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((error) => {
      next(error);
    });
};

const patchArticle = (req, res, next) => {
  editArticle(req)
    .then((updatedArticle) => {
      res.status(201).send(updatedArticle);
    })
    .catch((error) => {
      next(error);
    });
};
const deleteArticleById = (req, res, next) => {
  removeArticle(req)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = {
  getAllArticles,
  getArticleById,
  patchArticle,
  deleteArticleById,
  postArticle,
};
