// 📦 Import Dependencies
const express = require("express");

const router = express.Router();

// 🧠 Import Controller
const usersControllers = require("../../controllers/master/user.controller");

router.get("/", usersControllers.getUsers);

// router.post("/login", usersControllers.login);

module.exports = router;
