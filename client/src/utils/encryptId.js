import CryptoJS from "crypto-js";
const encryptId = (id) => {
  const ENCRYPTION_SECRET = import.meta.env.VITE_URL_ENCRYPTION_SECRET;
  const encryptedPostID = CryptoJS.AES.encrypt(
    id,
    ENCRYPTION_SECRET
  ).toString();

  const urlSafeEncryptedPostID = encryptedPostID
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return urlSafeEncryptedPostID;
};

export default encryptId;
