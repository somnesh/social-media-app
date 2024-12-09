const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middleware/admin-auth");

const {
  adminLogin,
  getDashboard,
  userManagement,
  logout,
} = require("../controllers/admin");

router.route("/login").post(adminLogin);
router.route("/logout").post(logout);
router.route("/dashboard").get(authenticateAdmin, getDashboard);
router.route("/user-management").get(authenticateAdmin, userManagement);

module.exports = router;
