const { v2: cloudinary } = require("cloudinary");

const getUploadSignature = (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000); // Current timestamp
  const paramsToSign = {
    timestamp: timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_CLOUD_API_SECRET
  );

  res.json({
    timestamp,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  });
};

module.exports = { getUploadSignature };
