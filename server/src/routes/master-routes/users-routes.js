const express = require("express");

const router = express.Router();

const usersControllers = require("../../controllers/master-controllers/users-controllers");

router.get("/", usersControllers.getUsers);

// router.post("/login", usersControllers.login);

module.exports = router;
