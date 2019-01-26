var env = process.env.NODE_ENV || "development";
var config = require("../knexfile")[env];
var db = require("knex")(config);

module.exports = db;
