const { sign, verify } = require("jsonwebtoken");

const generateToken = payload =>
  sign(payload, process.env.JWT_KEY, { expiresIn: "7days" });

const ensureToken = token => verify(token, process.env.JWt_KEY);

module.exports = {
  generateToken,
  ensureToken
};
