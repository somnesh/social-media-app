const express = require("express");
const router = express.Router();

const { adminLogin } = require("../controllers/admin");

router.route("/login").post(adminLogin);

module.exports = router;
