// extract any functions you are using to manipulate your data, into this file

const createArticlesRef = (articlesRows) => {
  const ref = {};
  articlesRows.forEach((article) => {
    ref[article.title] = article.article_id;
  });
  return ref;
};

//create format timestamp function
const convertTimeStamp = (time) => {
  const covertedTimeStamp = new Date(time).toISOString();
  return covertedTimeStamp;
};

const formatCommentsData = (commentsData, articlesRef) => {
  return commentsData.map(({ belongs_to, created_by, ...restOfComment }) => {
    const newComment = {
      ...restOfComment,
      article_id: articlesRef[belongs_to],
    };

    newComment.author = created_by;
    delete newComment.created_by;
    delete newComment.belongs_to;
    // use format timestamp function here
    newComment.created_at = convertTimeStamp(newComment.created_at);
    return newComment;
  });
};

const formatArticlesData = (articlesData) => {
  const formattedArticles = articlesData.map((article) => {
    article.created_at = convertTimeStamp(article.created_at);
    if (!article.hasOwnProperty("votes")) {
      article.votes = 0;
    }
    return article;
  });

  return formattedArticles;
};

module.exports = { createArticlesRef, formatCommentsData, formatArticlesData };
