const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");

const {
  BadRequestError,
  UnauthenticatedError,
  AccessDeniedError,
} = require("../errors");

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credential");
  }

  if (user.role !== "admin") {
    throw new AccessDeniedError("Access Denied");
  }

  //   matching the password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credential");
  }

  //   when both credentials are correct a Json token is created for the session
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      avatarBg: user.avatarBg,
    },
    token,
  });
};

module.exports = { adminLogin };
