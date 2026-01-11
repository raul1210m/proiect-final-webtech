// backend/src/db.js
const { Sequelize } = require("sequelize");

// Where the SQLite file is stored (relative to backend/ by default)
const storage = process.env.DB_STORAGE || "./dissertation.sqlite";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage,
  logging: false,
});

module.exports = { sequelize };
