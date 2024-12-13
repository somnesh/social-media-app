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
const { calculateSimilarity } = require("../controllers/recommendation");

router.route("/login").post(adminLogin);
router.route("/logout").post(logout);
router.route("/dashboard").get(authenticateAdmin, getDashboard);
router.route("/user-management").get(authenticateAdmin, userManagement);
router
  .route("/maintenance")
  .post(authenticateAdmin, setMaintenanceMode)
  .get(getMaintenanceMode);

router
  .route("/calculate-similarity")
  .post(authenticateAdmin, calculateSimilarity);

module.exports = router;
