const jwt = require("jsonwebtoken");
const { UnauthenticatedError, AccessDeniedError } = require("../errors");
const User = require("../models/User");

const adminAuth = async (req, res, next) => {
  const authToken =
    req.headers.authorization || "Bearer " + req.cookies?.accessToken;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authToken.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (payload.role !== "admin") {
      throw new AccessDeniedError("Access denied");
    }

    const user = await User.findById(payload.userId).select("-password");
    user.userId = payload.userId;
    req.user = user;
    next();
  } catch (error) {
    throw error;
  }
};

module.exports = adminAuth;
