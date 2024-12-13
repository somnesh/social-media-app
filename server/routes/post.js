const express = require("express");
const router = express.Router();

// const upload = require("../middleware/multer-middleware");
// const { uploadFile } = require("../middleware/uploadFile");
const multer = require("multer");
const upload = multer();

const {
  getAllPost,
  createPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  replyComment,
  deleteComment,
  sharePost,
  savePost,
  updateComment,
  likeComment,
  getSavedPosts,
  deleteSavedPost,
} = require("../controllers/post");
const { vote, getPoll, createPoll } = require("../controllers/Poll");

router.route("/all/:id").get(getAllPost); // ":id" -> userId

// router.route("/").post(upload.single("files"), uploadFile, createPost);
router.route("/").post(upload.none(), createPost);

router.route("/:id").patch(updatePost).delete(deletePost);

router.route("/like/:id").patch(likePost);

// comment
router
  .route("/comment/:id")
  .post(addComment) // ":id" -> here "id" is the "user id"
  .delete(deleteComment) // ":id" -> here "id" is the "comment id"
  .patch(updateComment);
router.route("/comment/:id/like").patch(likeComment);
router.route("/comment/:id/reply").post(replyComment); // ":id" -> here "id" is the "parent comment id"

// share post
router.route("/share/:id").post(sharePost);

// save post
router.route("/save/:id").post(savePost).delete(deleteSavedPost);
router.route("/fetch/save").get(getSavedPosts);

// poll
router.route("/polls/:pollId/vote").post(vote);
router.route("/polls/:pollId").get(getPoll);
router.route("/polls").post(createPoll);

module.exports = router;
