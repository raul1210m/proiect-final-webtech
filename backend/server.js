const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
console.log("CORS_ORIGIN =", process.env.CORS_ORIGIN);


console.log("JWT_SECRET loaded?", process.env.JWT_SECRET);


const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { sequelize } = require("./src/db");
require("./src/models"); // init relations

const authRoutes = require("./src/routes/auth.routes");
const usersRoutes = require("./src/routes/users.routes");
const sessionsRoutes = require("./src/routes/sessions.routes");
const requestsRoutes = require("./src/routes/requests.routes");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "*"}));
app.use(bodyParser.json());

app.get("/api", (req, res) => {
  res.json({ message: "Dissertation API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/sessions", sessionsRoutes);
app.use("/api/requests", requestsRoutes);

const PORT = process.env.PORT || 3000;

// IMPORTANT: nu mai folosim force:true (șterge db)
sequelize.sync().then(() => {
  console.log("Database synced!");
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
