const express = require("express");
const {
  fetchAllFeedbacks,
  deleteFeedback,
  submitFeedback,
} = require("../controllers/feedback");
const router = express.Router();

router.route("/").get(fetchAllFeedbacks).post(submitFeedback);
router.route("/:id").delete(deleteFeedback);

module.exports = router;
