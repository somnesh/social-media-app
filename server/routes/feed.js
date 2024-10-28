const express = require("express");
const router = express.Router();

const {
  generateFeed,
  logPostView,
  dislikePostRecommendation,
} = require("../controllers/feed");

router.route("/").get(generateFeed);
router.route("/log-post-view").post(logPostView);
router.route("/post/dislike").post(dislikePostRecommendation);

module.exports = router;
