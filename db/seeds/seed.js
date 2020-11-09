const data = require("../data");
const {
  createArticlesRef,
  formatCommentsData,
  formatArticlesData,
} = require("../../db/utils/data-manipulation");

exports.seed = function (connection) {
  // add seeding functionality here
  return connection.migrate
    .rollback()
    .then(() => {
      return connection.migrate.latest();
    })
    .then(() => {
      return connection
        .insert(data.topicsData)
        .into("topics")
        .returning("*")
        .then((topicsRows) => {
          console.log(`inserted ${topicsRows.length} topics`);
        });
    });
};
