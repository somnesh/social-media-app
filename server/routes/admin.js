const express = require("express");
const router = express.Router();
const authenticateAdmin = require("../middleware/admin-auth");

const {
  adminLogin,
  getDashboard,
  userManagement,
  logout,
  getContentModerationData,
  deletePostMedia,
  getCollectionList,
  generateQueryResponseFromGemini,
  suspendUser,
  revokeSuspension,
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
  .route("/content-moderation")
  .get(authenticateAdmin, getContentModerationData);
router
  .route("/delete-media/:postId")
  .delete(authenticateAdmin, deletePostMedia);

router.route("/get-collection-list").get(getCollectionList);
router
  .route("/generate-query-from-gemini")
  .get(generateQueryResponseFromGemini);
router.route("/suspend-user/:id").patch(suspendUser);
router.route("/revoke-suspension/:id").patch(revokeSuspension);

router
  .route("/maintenance")
  .post(authenticateAdmin, setMaintenanceMode)
  .get(getMaintenanceMode);

router
  .route("/calculate-similarity")
  .post(authenticateAdmin, calculateSimilarity);

module.exports = router;
