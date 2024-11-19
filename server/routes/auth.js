const express = require("express");
const router = express.Router();

const {
  loginUser,
  registerUser,
  verifyEmail,
  logout,
  refreshAccessToken,
  resetPassword,
  changePassword,
} = require("../controllers/auth");
const auth = require("../middleware/authentication");
const { verifyResetPassword } = require("../controllers/user");
const decryptUrl = require("../middleware/url-Decryption");

router.route("/signup").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user/verify-email").get(verifyEmail);
router.route("/user/reset-password").get(verifyResetPassword);
router.route("/reset-password/:id").post(decryptUrl, resetPassword);
router.route("/user/change-password").post(auth, changePassword);

router.route("/refresh-token").post(auth, refreshAccessToken);
router.route("/logout").post(auth, logout);
module.exports = router;
