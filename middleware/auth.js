const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied. Invalid Token.");

  try {
    const decoded = jwt.verify(token, keys.jwtKey);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send("Invalid Token.");
  }
}

module.exports = auth;
