const userService = require("../services/userService");

const signup = (req, res) => {
  const { email, password } = req.body;

  const user = userService.createUser(email, password);

  res.status(201).json({ message: "user created successfully" });
};

// authentication
const login = (req, res) => {
  const { email, password } = req.body;

  const { accessToken, refreshToken } = userService.verifyUser(email, password);

  res.cookie("refreshToken", refreshToken, {
    maxAge: 7 * 24 * 60 * 1000,
    httpOnly: true,
    sameSite: "Strict",
  });
  // XSS

  res.status(200).json({ message: "login successful", accessToken });
  // request header: Authorization
};

const refresh = (req, res) => {
  // store refresh token in memory, set cookie, verify token

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token" });

  const newAccessToken = userService.refreshAccessToken(refreshToken);

  res.json({ accessToken: newAccessToken });
};

module.exports = { signup, login, refresh };
