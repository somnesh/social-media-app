const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  const authToken =
    req.headers.authorization || "Bearer " + req.cookies?.accessToken;

  //this bypass the auth for retrieving a public post details
  if (
    (!authToken || authToken === "Bearer undefined") &&
    req.baseUrl === "/api/v1/post" &&
    req.method === "GET"
  ) {
    next();
    return;
  }

  if (!authToken || !authToken.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authToken.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId).select("-password");
    user.userId = payload.userId;
    req.user = user;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

module.exports = auth;
