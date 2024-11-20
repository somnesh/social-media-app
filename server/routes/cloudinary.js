const express = require("express");
const { getUploadSignature } = require("../controllers/cloudinary");
const router = express.Router();

router.route("/cloudinary-signature").get(getUploadSignature);

module.exports = router;
