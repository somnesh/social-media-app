const express = require("express");
const router = express.Router();

const {
  getPostDetails,
  getLikes,
  getComments,
} = require("../controllers/post");
const decryptUrl = require("../middleware/url-Decryption");

router.route("/:id").get(decryptUrl, getPostDetails);
router.route("/like/:id").get(getLikes);
router.route("/comment/:id").get(getComments); // ":id" -> here "id" is "post id"

module.exports = router;
