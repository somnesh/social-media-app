const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middleware/admin-auth");

const {
  adminLogin,
  getDashboard,
  userManagement,
  logout,
} = require("../controllers/admin");
const {
  setMaintenanceMode,
  getMaintenanceMode,
} = require("../controllers/maintenanceController");

router.route("/login").post(adminLogin);
router.route("/logout").post(logout);
router.route("/dashboard").get(authenticateAdmin, getDashboard);
router.route("/user-management").get(authenticateAdmin, userManagement);
router
  .route("/maintenance")
  .post(authenticateAdmin, setMaintenanceMode)
  .get(getMaintenanceMode);

module.exports = router;
