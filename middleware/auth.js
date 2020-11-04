const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const errorService = require("../services/errors");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token)
    return res
      .status(401)
      .send(errorService("InvalidTokenError", "Invalid Token. Access Denied."));

  try {
    const decoded = jwt.verify(token, keys.jwtKey);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).send(e);
  }
}

module.exports = auth;
