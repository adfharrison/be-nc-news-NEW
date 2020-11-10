const {
  fetchAllArticles,
  fetchArticleById,
  editArticle,
  removeArticle,
} = require('../models/articlesMDL');

const getAllArticles = (req, res, next) => {
  fetchAllArticles(req)
    .then((articles) => {
      res.status(200).send(articles);
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
const deleteArticleById = (req, res, nex) => {
  removeArticle(req)
    .then((msg) => {
      res.status(204).send(msg);
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
};
