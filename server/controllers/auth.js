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

  const uniqueUsername = await isUsernameUnique(username);
  if (!uniqueUsername) {
    throw new BadRequestError("Username already exists");
  }

  phone_no = Number(phone_no);
  const phoneNoAlreadyExists = await User.findOne({ phone_no });
  if (phoneNoAlreadyExists) {
    throw new BadRequestError("Phone number already exists");
  }
  req.body.phone_no = phone_no;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new BadRequestError("Email already exists");
  }

  const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_LIFESPAN,
  });

  const origin = process.env.API_URL;
  // Inserting data into the database
  const user = await User.create({
    ...req.body,
    refreshToken: refreshToken,
  });

  await sendVerificationEmail({
    name,
    email,
    refreshToken,
    origin,
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

  try {
    await user.save();
    res.redirect(`${process.env.CLIENT_URL}/email-verification-success`);
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.CLIENT_URL}/500`);
  }
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
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  };

  res
    .status(StatusCodes.OK)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json({
      user: {
        name: user.name,
        id: user._id,
        avatar: user.avatar,
        avatarBg: user.avatarBg,
        username: user.username,
        isSuspended: user.isSuspended,
        suspensionReason: user.suspensionReason,
      },
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
    throw new BadRequestError("Invalid refresh token user not found");
  }

  if (incomingUser?._id.toString() !== user?._id.toString()) {
    throw new BadRequestError("Invalid refresh token, user id not matched");
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
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
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
  try {
    await User.findByIdAndUpdate(
      req.user.userId,
      { $set: { refreshToken: null } },
      { new: true }
    );
  } catch (error) {
    console.log(error);
  }

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  };

  res
    .status(StatusCodes.OK)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json({ status: "success" });
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  // console.log(currentPassword, newPassword);

  if (!currentPassword || !newPassword) {
    throw new BadRequestError("Current password or new password is required");
  }

  const user = await User.findOne({ email: req.user.email });

  const isPasswordCorrect = await user.comparePassword(currentPassword);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(
      "Incorrect current password. Please ensure it's correct and try again"
    );
  }

  user.password = newPassword;
  await user.save();

  res.status(StatusCodes.OK).json({
    success: true,
    msg: "Your password has been successfully changed",
  });
};

const resetPassword = async (req, res) => {
  const { id: userId } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      msg: "Password is required",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, msg: "User not found" });
  }

  user.password = password;
  user.refreshToken = null;

  await user.save();

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "Password reset successful" });
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  refreshAccessToken,
  logout,
  resetPassword,
  changePassword,
};
