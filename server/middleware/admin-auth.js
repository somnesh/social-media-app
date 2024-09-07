const jwt = require("jsonwebtoken");
const { UnauthenticatedError, AccessDeniedError } = require("../errors");

const adminAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "admin") {
      throw new AccessDeniedError("Access denied, Contact admin");
    }

    next();
  } catch (error) {
    throw error;
  }
};

module.exports = adminAuth;
