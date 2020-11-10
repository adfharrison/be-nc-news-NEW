const connection = require('../db/data/connections');

const fetchCommentsByArticleId = (
  req,
  sort_by = 'created_at',
  order = 'desc'
) => {
  id = req.params.article_id;

  return connection
    .select('*')
    .from('comments')
    .where('article_id', '=', id)
    .orderBy(sort_by, order)
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: 'Comments Not Found' });
      } else {
        comments.forEach((comment) => {
          delete comment.article_id;
        });
        return comments;
      }
    });
};
module.exports = { fetchCommentsByArticleId };
