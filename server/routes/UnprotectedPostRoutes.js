const express = require("express");
const router = express.Router();

const {
  getPostDetails,
  getLikes,
  getComments,
  getCommentReplies,
} = require("../controllers/post");
const decryptUrl = require("../middleware/url-Decryption");

router.route("/:id").get(decryptUrl, getPostDetails);
router.route("/like/:id").get(getLikes);
router.route("/comment/:id").get(getComments); // ":id" -> here "id" is "post id"
router.route("/comment/:id/reply").get(getCommentReplies);

module.exports = router;
