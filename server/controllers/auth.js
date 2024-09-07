const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const sendVerificationEmail = require("../utils/sendVerificationEmail");

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

  const verificationToken = "1234";
  const origin = "http://localhost:3000/api/v1/";
  await sendVerificationEmail({
    name,
    email,
    verificationToken,
    origin,
  });

  // Inserting data into the database
  const user = await User.create({
    ...req.body,
    verificationToken: verificationToken,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Success! Please check your email to verify account" });
};

const verifyEmail = async (req, res) => {
  const { token: verificationToken, email } = req.query;
  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Verification Failed");
  }

  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError("Verification Failed");
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

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
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user: { name: user.name, id: user._id }, token });
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
};
