const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../services/userService");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization; // Bearer token

  if (!authHeader)
    return res.status(401).json({ message: "Missing authorization header" });

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    console.log(payload);

    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "invalid token" });
  }
}

module.exports = { authMiddleware };
