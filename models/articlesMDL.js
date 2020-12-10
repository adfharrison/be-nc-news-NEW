const connection = require('../db/data/connections');
const articlesRouter = require('../routers/articlesRouter');

const fetchAllArticles = (
  req,
  sort_by = 'created_at',
  order = 'desc',
  limit = 10,
  page = 1,
  author,
  topic
) => {
  id = req.params.article_id;
  offset = (page - 1) * limit;

  let newOrder = order;
  // if (sort_by !== 'created_at' && sort_by !== 'votes') {
  //   newOrder = 'asc';
  // }

  return Promise.all([
    connection
      .select('articles.*')
      .count('comment_id AS comment_count')
      .from('articles')
      .modify((queryBuilder) => {
        if (author) {
          queryBuilder.where('articles.author', '=', author);
        }
        if (topic) {
          queryBuilder.where('articles.topic', '=', topic);
        }
      })
      .leftJoin('comments', 'articles.article_id', '=', 'comments.article_id')
      .groupBy('articles.article_id')
      .limit(limit)
      .orderBy(sort_by, newOrder)
      .offset(offset),
    connection.select('*').from('articles'),
  ]).then((promises) => {
    articlesRows = promises[0];
    totalArticles = promises[1].length;

    return { articles: articlesRows, total_count: totalArticles };
  });
};

const sendArticle = (req) => {
  article = req.body.newArticle;
  return connection
    .insert(article, ['*'])
    .into('articles')
    .then((postedArticle) => {
      return { newArticle: postedArticle[0] };
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
