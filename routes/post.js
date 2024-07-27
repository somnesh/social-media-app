const express = require("express");
const router = express.Router();

const {
  createPost,
  getPostDetails,
  updatePost,
  deletePost,
} = require("../controllers/post");

router.route("/").post(createPost);
router.route("/:id").get(getPostDetails).patch(updatePost).delete(deletePost);

module.exports = router;
