const fs = require("fs");
const cloudinary = require("./cloudinaryConfig");
require("dotenv").config();
const { InternalServerError } = require("../errors");

const uploadFileCloudinary = async (localPath) => {
  try {
    if (!localPath) {
      return null;
    }

    // uploading file
    const response = await cloudinary.uploader.upload(localPath, {
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    console.log(error);

    throw new InternalServerError("File upload failed!");
  } finally {
    fs.unlinkSync(localPath);
  }
};

module.exports = uploadFileCloudinary;
