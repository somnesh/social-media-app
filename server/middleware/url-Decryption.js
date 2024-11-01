const CryptoJS = require("crypto-js");

const decryptUrl = (req, res, next) => {
  const encryptedId = req.params.id;

  if (encryptedId.length !== 24) {
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
