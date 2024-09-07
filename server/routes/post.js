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
} = require("../controllers/post");

router
  .route("/")
  .get(getAllPost)
  .post(upload.single("files")  , uploadFile, createPost);
router.route("/:id").get(getPostDetails).patch(updatePost).delete(deletePost);

module.exports = router;
