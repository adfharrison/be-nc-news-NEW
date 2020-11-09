// extract any functions you are using to manipulate your data, into this file

const createArticlesRef = (articlesRows) => {
  const ref = {};
  articlesRows.forEach((article) => {
    ref[article.title] = article.article_id;
  });
  return ref;
};

//create format timestamp function

const formatCommentsData = (commentsData, articlesRef) => {
  return commentsData.map(({ title, ...restOfComment }) => {
    const newComment = {
      ...restOfComment,
      article_id: articlesRef[title],
    };

    newComment.author = comments.data.created_by;
    delete newComment.created_by;
    delete newComment.belongs_to;
    // use format timestamp function here
    return newComment;
  });
};

module.exports = { createArticlesRef, formatCommentsData };
