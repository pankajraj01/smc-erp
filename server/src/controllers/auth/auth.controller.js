// Import Dependencies/Packages
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Import Files
const HttpError = require("../../utils/httpError");
const User = require("../../models/master/user.model");

const login = async (req, res, next) => {
  const { userName, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ userName });
  } catch (err) {
    return next(new HttpError("Login failed, try again later.", 500));
  }

  if (!existingUser) {
    return next(new HttpError("Invalid credentials", 403));
  }

  const isValidPassword = await bcrypt.compare(password, existingUser.password);
  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials", 403));
  }

  // Generate JWT
  let token;
  try {
    token = jwt.sign(
      { userId: existingUser._id, userName: existingUser.userName },
      "supersecret_jwt_key", // change this to env secret in production
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Token generation failed.", 500));
  }

  res.json({
    message: "Login successful",
    userId: existingUser._id,
    userName: existingUser.userName,
    name: existingUser.name,
    token,
  });
};

exports.login = login;
