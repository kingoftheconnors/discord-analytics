var db = require("knex")({
  client: "pg",
  connection: process.env.DATABASE_URL,
  searchPath: ["public"]
});

module.exports = db;
