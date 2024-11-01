const express = require("express");
const router = express.Router();

const upload = require("../middleware/multer-middleware");
const { uploadFile } = require("../middleware/uploadFile");

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
} = require("../controllers/post");

router
  .route("/")
  .get(getAllPost)
  .post(upload.single("files"), uploadFile, createPost);

router.route("/:id").patch(updatePost).delete(deletePost);

router.route("/like/:id").patch(likePost);

router
  .route("/comment/:id")
  .patch(addComment) // ":id" -> here "id" is the "user id"
  .delete(deleteComment); // ":id" -> here "id" is the "comment id"

router.route("/comment/reply/:id").post(replyComment); // ":id" -> here "id" is the "parent comment id"
router.route("/share/:id").post(sharePost);

router.route("/save/:id").post(savePost);

module.exports = router;
