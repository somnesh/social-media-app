const express = require("express");
const router = express.Router();

const { loginUser, registerUser } = require("../controllers/auth");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

module.exports = router;
