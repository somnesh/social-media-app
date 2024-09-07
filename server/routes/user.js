const express = require("express");
const router = express.Router();

const authenticateAdmin = require("../middleware/admin-auth");

const {
  getAllUsers,
  getUserDetails,
  uploadProfilePicture,
  updateUserDetails,
  deleteUser,
} = require("../controllers/user");

router.route("/").get(authenticateAdmin, getAllUsers); // For admin

router
  .route("/:id")
  .get(getUserDetails)
  .patch(updateUserDetails)
  .delete(deleteUser);
router.route("/:id/uploads").post(uploadProfilePicture);

module.exports = router;
