const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const sendVerificationEmail = require("../utils/sendVerificationEmail");
const jwt = require("jsonwebtoken");

const isUsernameUnique = async (username) => {
  const isUnique = await User.findOne({ username });
  if (isUnique) {
    return false;
  } else {
    return true;
  }
};

// for new user registration
const registerUser = async (req, res) => {
  const { name, username, email } = req.body;
  let { phone_no } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError("Email already exists");
  }

  if (!isUsernameUnique(username)) {
    throw new BadRequestError("Username already exists");
  }

  phone_no = Number(phone_no);
  const phoneNoAlreadyExists = await User.findOne({ phone_no });
  if (phoneNoAlreadyExists) {
    throw new BadRequestError("Phone No. already exists");
  }
  req.body.phone_no = phone_no;

  const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_LIFESPAN,
  });

  const origin = "http://localhost:3000/api/v1/";
  await sendVerificationEmail({
    name,
    email,
    refreshToken,
    origin,
  });

  // Inserting data into the database
  const user = await User.create({
    ...req.body,
    refreshToken: refreshToken,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Success! Please check your email to verify account" });
};

const verifyEmail = async (req, res) => {
  const { token: refreshToken, email } = req.query;
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Verification Failed");
  }

  if (user.refreshToken !== refreshToken) {
    throw new UnauthenticatedError("Verification Failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.refreshToken = null;

  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email Verified" });
};

// for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  //   checking whether the email exists in the database or not
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credential");
  }

  //   matching the password
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid credential");
  }

  //   when both credentials are correct a Json token is created for the session
  const accessToken = user.createJWT();
  const refreshToken = user.createJWTRefresh();

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res
    .status(StatusCodes.OK)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      user: { name: user.name, id: user._id },
      accessToken,
      refreshToken,
    });
};

const refreshAccessToken = async (req, res) => {
  const user = await User.findById(req.user.userId);
  const incomingRefreshToken = req.cookies.refreshToken;

  if (!incomingRefreshToken) {
    throw new BadRequestError("Token undefined");
  }

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  const incomingUser = await User.findById(decodedToken?.userId);

  if (!incomingUser) {
    throw new BadRequestError("Invalid refresh token");
  }

  if (incomingUser?._id !== user?._id) {
    throw new BadRequestError("Invalid refresh token");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new BadRequestError("Invalid refresh token");
  }

  const accessToken = user.createJWT();
  const refreshToken = user.createJWTRefresh();

  user.refreshToken = refreshToken;
  user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res
    .status(StatusCodes.OK)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      user: { name: user.name, id: user._id },
      accessToken,
      refreshToken,
    });
};

const logout = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user.userId,
    { $set: { refreshToken: null } },
    { new: true }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  res
    .status(StatusCodes.OK)
    .clearCookie("AccessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({ status: "success" });
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  refreshAccessToken,
  logout,
};
