const data = require('../data');
const {
  createArticlesRef,
  formatCommentsData,
  formatArticlesData,
} = require('../../db/utils/data-manipulation');

exports.seed = function (connection) {
  // add seeding functionality here
  return connection.migrate
    .rollback()
    .then(() => {
      return connection.migrate.latest();
    })
    .then(() => {
      return connection.insert(data.topicsData).into('topics').returning('*');
    })
    .then((topicsRows) => {
      console.log(`inserted ${topicsRows.length} topics`);
      return connection.insert(data.usersData).into('users').returning('*');
    })
    .then((usersRows) => {
      console.log(`inserted ${usersRows.length} users`);

      const formattedArticles = formatArticlesData(data.articlesData);

      return connection
        .insert(formattedArticles)
        .into('articles')
        .returning('*');
    })
    .then((articlesRows) => {
      console.log(`inserted ${articlesRows.length} articles`);

      const articlesRef = createArticlesRef(articlesRows);
      const formattedComments = formatCommentsData(
        data.commentsData,
        articlesRef
      );

      return connection
        .insert(formattedComments)
        .into('comments')
        .returning('*');
    })
    .then((commentsRows) => {
      console.log(`inserted ${commentsRows.length} comments`);
    });
};
