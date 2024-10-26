const express = require("express");
const router = express.Router();

const { generateFeed, logPostView } = require("../controllers/feed");

router.route("/").get(generateFeed);
router.route("/log-post-view").post(logPostView);

module.exports = router;
