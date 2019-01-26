// Update with your config settings.

module.exports = {
  development: {
    client: "postgresql",
    connection: process.env.DATABASE_URL || {
      host: "localhost",
      user: "postgres",
      password: "",
      database: "discordanalytics_dev"
    }
  },

  production: {
    client: "postgresql",
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 10
    }
  }
};
