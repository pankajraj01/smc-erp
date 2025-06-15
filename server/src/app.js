// 📦 Import Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// 🛣️ Import Routes
const authRoutes = require("./routes/auth/auth.routes");
const usersRoutes = require("./routes/master/user.routes");

const itemRoutes = require("./routes/master/item.routes");
const agentsRotes = require("./routes/master/agent.routes");
const partyRoutes = require("./routes/master/party.routes");
const millRoutes = require("./routes/master/mill.routes");

const greyOrderRoutes = require("./routes/grey/grey-order.routes");

// ⚙️ Import Services
const HttpError = require("./utils/httpError");

const app = express();
app.use(bodyParser.json());

// Middleware to handle CORS and set headers
// This middleware will allow cross-origin requests and set necessary headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, PUT, OPTIONS"
  );

  // ✅ Handle preflight request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
// Middleware to parse JSON bodies

// Auth Routes
app.use("/api/auth", authRoutes);

// User Routes
app.use("/api/users", usersRoutes);

// Master Routes
app.use("/api/master/items", itemRoutes);
app.use("/api/master/agents", agentsRotes);
app.use("/api/master/parties", partyRoutes);
app.use("/api/master/mills", millRoutes);

// Grey Order Routes
app.use("/api/grey-orders", greyOrderRoutes);

// Fallback for undefined routes
app.use((req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
});

// Error handling middleware
// This middleware will catch any errors thrown in the routes or controllers
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An Unknown error occurred!" });
});

mongoose
  .connect(
    "mongodb+srv://pankaj:pankaj123@cluster0.mvdxo8u.mongodb.net/smc?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });
