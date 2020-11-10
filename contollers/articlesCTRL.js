const { fetchAllArticles, fetchArticleById } = require('../models/ArticlesMDL');

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

module.exports = { getAllArticles, getArticleById };
