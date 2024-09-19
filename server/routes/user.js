const express = require("express");
const router = express.Router();

const authenticateAdmin = require("../middleware/admin-auth");

const {
  getAllUsers,
  getUserDetails,
  uploadProfilePicture,
  updateUserDetails,
  deleteUser,
  followUser,
  unfollowUser,
} = require("../controllers/user");

router.route("/").get(authenticateAdmin, getAllUsers); // For admin

router
  .route("/:id")
  .get(getUserDetails)
  .patch(updateUserDetails)
  .delete(deleteUser);
router.route("/:id/uploads").post(uploadProfilePicture);

router.route("/follow/:id").post(followUser);
router.route("/unfollow/:id").delete(unfollowUser);

module.exports = router;
