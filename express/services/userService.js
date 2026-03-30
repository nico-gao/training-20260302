const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { users } = require("../models");

const JWT_SECRET = "JWT_SECRET";
const REFRESH_TOKEN_SECRET = "REFRESH_TOKEN_SECRET";

const createUser = (email, password) => {
  const hasedPassword = bcrypt.hashSync(password, 10);

  const userExisted = users.some((user) => user.email === email);

  if (userExisted) {
    return res.status(400).json({ message: "user already exists" });
  }

  users.push({
    id: crypto.randomUUID(),
    email,
    password: hasedPassword,
  });

  return users;
};

const verifyUser = (email, password) => {
  const user = users.find((user) => user.email === email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "invalid credential" });
  }

  const accessToken = jwt.sign(user, JWT_SECRET, { expiresIn: "30s" });
  console.log(accessToken);

  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const refreshAccessToken = (refreshToken) => {
  const { email, password } = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);

  const newAccessToken = jwt.sign({ email, password }, JWT_SECRET, {
    expiresIn: "30s",
  });

  return newAccessToken;
};

module.exports = {
  createUser,
  verifyUser,
  JWT_SECRET,
  REFRESH_TOKEN_SECRET,
  refreshAccessToken,
};
