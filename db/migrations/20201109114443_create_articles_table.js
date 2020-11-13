exports.up = function (knex) {
  //console.log('creating articles table');
  return knex.schema.createTable('articles', (articlesTable) => {
    articlesTable.increments('article_id').primary();
    articlesTable.text('title').notNullable();
    articlesTable.text('body').notNullable();
    articlesTable.integer('votes').defaultTo(0);
    articlesTable.text('topic').references('topics.slug').onDelete('SET NULL');
    articlesTable
      .text('author')
      .references('users.username')
      .onDelete('SET NULL');
    articlesTable.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  //console.log('dropping articles table');
  return knex.schema.dropTable('articles');
};
