// 📦 Import Dependencies
const express = require("express");

const router = express.Router();

// 🧠 Import Controller
const authControllers = require("../../controllers/auth/auth.controller");

router.post("/login", authControllers.login);

module.exports = router;
