const express = require("express");
const {
  createReport,
  getReport,
  getAllReports,
  markReportAsUnderReview,
  markReportAsResolved,
  deleteReport,
} = require("../controllers/report");
const router = express.Router();

router.route("/").get(getAllReports);
router.route("/:id").get(getReport).post(createReport);
router.route("/mark-under-review/:id").post(markReportAsUnderReview);
router.route("/mark-resolved/:id").post(markReportAsResolved);
router.route("/delete/:id").delete(deleteReport);

module.exports = router;
