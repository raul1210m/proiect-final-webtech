const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Session = sequelize.define("session", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  description: { type: DataTypes.STRING, allowNull: true },
  startDate: { type: DataTypes.DATE, allowNull: false },
  endDate: { type: DataTypes.DATE, allowNull: false },
  maxSlots: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 5 }
});

module.exports = Session;
