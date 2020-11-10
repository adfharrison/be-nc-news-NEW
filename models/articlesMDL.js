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
  const id = req.params.article_id;
  return Promise.all([
    connection.select('*').from('articles').where('article_id', '=', id),
    connection.select('*').from('comments').where('article_id', '=', id),
  ]).then((promises) => {
    const articles = promises[0];
    const comments = promises[1];
    if (articles.length === 0) {
      return Promise.reject({ status: 404, msg: 'Article Not Found' });
    } else {
      article = articles[0];
      article.comment_count = comments.length;
      return { article: article };
    }
  });
};

const editArticle = (req) => {
  const id = req.params.article_id;
  let num = req.body.inc_votes;

  if (num === undefined) {
    num = 0;
  }
  return connection
    .from('articles')
    .where('article_id', '=', id)
    .increment('votes', num)
    .then(() => {
      return fetchArticleById(req);
    });
};

const removeArticle = (req) => {
  const id = req.params.article_id;
  console.log(id, '<<<ID in mdl');
};
module.exports = {
  removeArticle,
  fetchAllArticles,
  fetchArticleById,
  editArticle,
};
