const express = require("express");
const router = express.Router();

const {
  loginUser,
  registerUser,
  verifyEmail,
  logout,
  refreshAccessToken,
} = require("../controllers/auth");
const auth = require("../middleware/authentication");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user/verify-email").get(verifyEmail);

router.route("/refresh-token").post(auth, refreshAccessToken);
router.route("/logout").post(auth, logout);
module.exports = router;
