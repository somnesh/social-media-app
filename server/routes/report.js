const express = require("express");
const { report } = require("../controllers/report");
const router = express.Router();

router.route("/:id").post(report);

module.exports = router;
