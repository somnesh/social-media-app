const CryptoJS = require("crypto-js");
const mongoose = require("mongoose");
const decryptUrl = (req, res, next) => {
  const encryptedId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(encryptedId)) {
    const base64 = encryptedId.replace(/-/g, "+").replace(/_/g, "/");

    const bytes = CryptoJS.AES.decrypt(
      base64,
      process.env.URL_ENCRYPTION_SECRET
    );
    const decryptedId = bytes.toString(CryptoJS.enc.Utf8);

    req.params.id = decryptedId;
  }

  next();
};

module.exports = decryptUrl;
