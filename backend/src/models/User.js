const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  role: { type: DataTypes.ENUM("STUDENT", "PROFESSOR"), allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false }
});

module.exports = User;
