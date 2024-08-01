const express = require("express");
const router = express.Router();

const {
  getAllPost,
  createPost,
  getPostDetails,
  updatePost,
  deletePost,
} = require("../controllers/post");

router.route("/").get(getAllPost).post(createPost);
router.route("/:id").get(getPostDetails).patch(updatePost).delete(deletePost);

module.exports = router;
