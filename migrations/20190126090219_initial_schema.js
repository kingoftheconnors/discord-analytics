exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("user_activity", function(table) {
      table.increments();
      table.string("username");
      table.string("status");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("user_activity")]);
};
