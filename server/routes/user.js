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
  getFollowerList,
  getFollowingList,
  removeFollower,
  searchUser,
} = require("../controllers/user");
const { getNotifications } = require("../controllers/notification");

router.route("/").get(authenticateAdmin, getAllUsers); // For admin

router
  .route("/:idOrUsername")
  .get(getUserDetails)
  .patch(updateUserDetails)
  .delete(deleteUser);
router.route("/:id/uploads").post(uploadProfilePicture);

router.route("/follow/:id").post(followUser);
router.route("/unfollow/:id").delete(unfollowUser);
router.route("/remove-follower/:id").delete(removeFollower);

router.route("/fetch/notification").get(getNotifications);
router.route("/fetch/followerList").get(getFollowerList);
router.route("/fetch/followingList").get(getFollowingList);

router.route("/global/search").get(searchUser);

module.exports = router;
