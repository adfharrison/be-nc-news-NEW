const connection = require('../db/data/connections');

const fetchAllArticles = (req, sort_by = 'created_at', order = 'desc') => {
  id = req.params.article_id;
  return connection
    .select('*')
    .from('articles')
    .orderBy(sort_by, order)
    .then((articlesRows) => {
      return { articles: articlesRows };
    });
};

const sendArticle = (req) => {
  article = req.body;
  return connection
    .insert(article, ['*'])
    .into('articles')
    .then((postedArticle) => {
      return postedArticle[0];
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

  return connection
    .delete()
    .from('articles')
    .where('article_id', '=', id)
    .then((delCount) => {
      if (delCount === 0) {
        return Promise.reject({ status: 404, msg: 'Article Not Found' });
      }
    });
};
module.exports = {
  removeArticle,
  fetchAllArticles,
  fetchArticleById,
  editArticle,
  sendArticle,
};
