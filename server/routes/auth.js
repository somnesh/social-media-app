const express = require("express");
const router = express.Router();

const { loginUser, registerUser, verifyEmail } = require("../controllers/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user/verify-email").post(verifyEmail);

module.exports = router;
