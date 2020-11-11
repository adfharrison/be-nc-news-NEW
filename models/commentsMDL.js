const connection = require('../db/data/connections');

const fetchAllComments = (req, sort_by = 'created_at', order = 'desc') => {
  id = req.params.article_id;
  return connection
    .select('*')
    .from('comments')
    .orderBy(sort_by, order)
    .then((commentsRows) => {
      return { comments: commentsRows };
    });
};

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
        return { comments: comments };
      }
    });
};

const fetchCommentById = (req) => {
  id = req.params.comment_id;

  return connection
    .select('*')
    .from('comments')
    .where('comment_id', '=', id)
    .then((returnedComment) => {
      if (returnedComment.length === 0) {
        return Promise.reject({ status: 404, msg: 'Comment Not Found' });
      } else {
        return returnedComment[0];
      }
    });
};

const sendComment = (req) => {
  comment = req.body;
  id = req.params.article_id;

  comment.author = comment.username;
  comment.article_id = id;
  delete comment.username;

  return connection
    .insert(comment, ['*'])
    .into('comments')
    .join()

    .then((postedComment) => {
      return postedComment[0];
    });
};

const editComment = (req) => {
  const id = req.params.comment_id;
  let num = req.body.inc_votes;

  if (num === undefined) {
    num = 0;
  }
  return connection
    .from('comments')
    .where('comment_id', '=', id)
    .increment('votes', num)
    .then(() => {
      return fetchCommentById(req);
    });
};

const removeCommentById = (req) => {
  const id = req.params.comment_id;

  return connection
    .del()
    .from('comments')
    .where('comment_id', '=', id)
    .then((delCount) => {
      if (delCount === 0) {
        return Promise.reject({ status: 404, msg: 'Comment Not Found' });
      }
    });
};
module.exports = {
  fetchCommentById,
  editComment,
  fetchCommentsByArticleId,
  sendComment,
  fetchAllComments,
  removeCommentById,
};
