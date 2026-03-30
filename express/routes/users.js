var express = require("express");
var router = express.Router();
const userController = require("../controllers/users");
const { authMiddleware } = require("../middlewares/auth");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/refresh", userController.refresh);

router.post("/logout", authMiddleware, (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
