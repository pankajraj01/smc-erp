// 📦 Import Dependencies
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const { PORT, API_VERSION, MONGO_URI } = require("./config");

// 🛣️ Import Routes
const authRoutes = require("./routes/auth/auth.routes");
const usersRoutes = require("./routes/master/user.routes");

const itemRoutes = require("./routes/master/item.routes");
const agentsRotes = require("./routes/master/agent.routes");
const partyRoutes = require("./routes/master/party.routes");
const millRoutes = require("./routes/master/mill.routes");

const greyOrderRoutes = require("./routes/grey/grey-order.routes");

const neftRequestRoutes = require("./routes/neft/neft-request.routes");

const pdfTestRoutes = require("./routes/neft/pdfTest.routes");

// ⚙️ Import Services
const HttpError = require("./utils/httpError");

const app = express();
app.use(bodyParser.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, DELETE, PUT, OPTIONS"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true"); // ✅ Add this line!

//   if (req.method === "OPTIONS") {
//     return res.sendStatus(200);
//   }

//   next();
// });

// Middleware to parse JSON bodies

// Auth Routes
app.use(`${API_VERSION}/auth`, authRoutes);

// User Routes
app.use(`${API_VERSION}/master/user`, usersRoutes);

// Master Routes
app.use(`${API_VERSION}/master/item`, itemRoutes);
app.use(`${API_VERSION}/master/agent`, agentsRotes);
app.use(`${API_VERSION}/master/party`, partyRoutes);
app.use(`${API_VERSION}/master/mill`, millRoutes);

// Grey Order Routes
app.use(`${API_VERSION}/grey-orders`, greyOrderRoutes);

// NEFT Routes
app.use(`${API_VERSION}/nefts`, neftRequestRoutes);

// PDF Test Route
app.use(`${API_VERSION}/nefts`, pdfTestRoutes);

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
console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
