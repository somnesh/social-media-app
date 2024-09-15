const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer-middleware");
const { uploadFile } = require("../middleware/uploadFile");

const {
  getAllPost,
  createPost,
  getPostDetails,
  updatePost,
  deletePost,
  likePost,
  getLikes,
  addComment,
  getComments,
  replyComment,
  deleteReply,
  deleteComment,
  sharePost,
} = require("../controllers/post");

router
  .route("/")
  .get(getAllPost)
  .post(upload.single("files"), uploadFile, createPost);

router.route("/:id").get(getPostDetails).patch(updatePost).delete(deletePost);

router.route("/like/:id").get(getLikes).patch(likePost);

router
  .route("/comment/:id")
  .get(getComments) // ":id" -> here "id" is "post id"
  .patch(addComment) // ":id" -> here "id" is the "user id"
  .delete(deleteComment); // ":id" -> here "id" is the "comment id"

router.route("/reply/:id").patch(replyComment).delete(deleteReply); // ":id" -> here "id" is the "parent comment id"
router.route("/share/:id").patch(sharePost);

module.exports = router;
