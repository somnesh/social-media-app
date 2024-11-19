const CryptoJS = require("crypto-js");
const encryptId = (id) => {
  const encryptedPostID = CryptoJS.AES.encrypt(
    id,
    process.env.URL_ENCRYPTION_SECRET
  ).toString();

  const urlSafeEncryptedPostID = encryptedPostID
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return urlSafeEncryptedPostID;
};

module.exports = encryptId;
