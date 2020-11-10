const connection = require('../db/data/connections');

const fetchAllArticles = () => {
  return connection
    .select('*')
    .from('articles')
    .then((articlesRows) => {
      return { articles: articlesRows };
    });
};

const fetchArticleById = (req) => {
  const id = req.params.id;
  return connection
    .select('*')
    .from('articles')
    .where('id', '=', id)
    .then((articleRows) => {
      if (articleRows.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      } else {
        return { requestedarticle: articleRows[0] };
      }
    });
};
module.exports = { fetchAllArticles, fetchArticleById };
