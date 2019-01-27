exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable("user_activity", function(table) {
      table
        .bigInteger("user_id")
        .notNullable()
        .defaultTo(0);
      table
        .bigInteger("user_id")
        .notNullable()
        .alter();
    }),
    knex.schema.alterTable("user_chat", function(table) {
      table
        .bigInteger("user_id")
        .notNullable()
        .defaultTo(0);
      table
        .bigInteger("user_id")
        .notNullable()
        .alter();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable("user_activity", function(table) {
      table.dropColumn("user_id");
    }),
    knex.schema.alterTable("user_chat", function(table) {
      table.dropColumn("user_id");
    })
  ]);
};
