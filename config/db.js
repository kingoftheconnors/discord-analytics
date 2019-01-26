var db = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
  searchPath: ["public"],
  migrations: {
    tableName: "migrations"
  }
});

module.exports = db;
