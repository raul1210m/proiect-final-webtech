const User = require("./User");
const Session = require("./Session");
const Request = require("./Request");

// Relations
User.hasMany(Session, { foreignKey: "professorId" });
Session.belongsTo(User, { as: "professor", foreignKey: "professorId" });

Session.hasMany(Request, { foreignKey: "sessionId" });
Request.belongsTo(Session, { foreignKey: "sessionId" });

User.hasMany(Request, { foreignKey: "studentId" });
Request.belongsTo(User, { as: "student", foreignKey: "studentId" });

module.exports = { User, Session, Request };
