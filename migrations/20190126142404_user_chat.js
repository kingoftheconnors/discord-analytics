exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("user_chat", function(table) {
      table.increments();
      table.string("username");
      table
        .integer("length")
        .unsigned()
        .notNullable();
      table
        .integer("attachments")
        .unsigned()
        .notNullable();
      table.string("interaction_type");
      table.timestamp("timestamp").defaultTo(knex.fn.now());
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable("user_chat")]);
};
