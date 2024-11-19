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
  forgotPassword,
} = require("../controllers/user");
const { getNotifications } = require("../controllers/notification");
const { uploadFile } = require("../middleware/uploadFile");
const auth = require("../middleware/authentication");

router.route("/").get(authenticateAdmin, getAllUsers); // For admin

// auth middleware is used between specific routes

router
  .route("/:idOrUsername")
  .get(auth, getUserDetails)
  .patch(auth, updateUserDetails)
  .delete(deleteUser); // need to authenticate

router
  .route("/uploads/profile-picture")
  .post(auth, upload.single("files"), uploadFile, uploadProfilePicture);
router
  .route("/uploads/cover-photo")
  .post(auth, upload.single("files"), uploadFile, uploadCoverPhoto);

router.route("/follow/:id").post(auth, followUser);
router.route("/unfollow/:id").delete(auth, unfollowUser);
router.route("/remove-follower/:id").delete(auth, removeFollower);

router.route("/fetch/notification").get(auth, getNotifications);
router.route("/fetch/followerList").get(auth, getFollowerList);
router.route("/fetch/followingList").get(auth, getFollowingList);

router.route("/global/search").get(searchUser);

router.route("/reset-password/:email").post(forgotPassword);

module.exports = router;
