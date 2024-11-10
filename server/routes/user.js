const express = require("express");
const router = express.Router();

const authenticateAdmin = require("../middleware/admin-auth");
const upload = require("../middleware/multer-middleware");

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
  uploadCoverPhoto,
} = require("../controllers/user");
const { getNotifications } = require("../controllers/notification");
const { uploadFile } = require("../middleware/uploadFile");

router.route("/").get(authenticateAdmin, getAllUsers); // For admin

router
  .route("/:idOrUsername")
  .get(getUserDetails)
  .patch(updateUserDetails)
  .delete(deleteUser);

router
  .route("/uploads/profile-picture")
  .post(upload.single("files"), uploadFile, uploadProfilePicture);
router
  .route("/uploads/cover-photo")
  .post(upload.single("files"), uploadFile, uploadCoverPhoto);

router.route("/follow/:id").post(followUser);
router.route("/unfollow/:id").delete(unfollowUser);
router.route("/remove-follower/:id").delete(removeFollower);

router.route("/fetch/notification").get(getNotifications);
router.route("/fetch/followerList").get(getFollowerList);
router.route("/fetch/followingList").get(getFollowingList);

router.route("/global/search").get(searchUser);

module.exports = router;
