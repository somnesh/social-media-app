const uploadFileCloudinary = require("../utils/cloudinary");
const uploadFile = async (req, res, next) => {
  if (req.file) {
    const response = await uploadFileCloudinary(req.file.path);
    req.body.cloudinaryRes = response;
  }
  next();
};

module.exports = { uploadFile };
