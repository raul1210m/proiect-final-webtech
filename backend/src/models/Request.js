const { DataTypes } = require("sequelize");
const { sequelize } = require("../db");

const Request = sequelize.define("request", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  status: {
    type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
    allowNull: false,
    defaultValue: "PENDING"
  },
  justification: { type: DataTypes.STRING, allowNull: true },
  studentDocUrl: { type: DataTypes.STRING, allowNull: true },
  profDocUrl: { type: DataTypes.STRING, allowNull: true }
});

module.exports = Request;
