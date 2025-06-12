const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  try {
    const token = req.headers.authorization.split(" ")[1]; // "Bearer TOKEN"
    if (!token) throw new Error("Authentication failed!");

    const decodedToken = jwt.verify(token, "supersecret_jwt_key");
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Auth failed!" });
  }
};
