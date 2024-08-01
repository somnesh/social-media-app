const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

// for new user registration
const registerUser = async (req, res) => {
  const { phone_no } = req.body;
  req.body.phone_no = Number(phone_no);

  // Inserting data into the database
  const user = await User.create({ ...req.body });
  const token = user.createJWT();

  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token });
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
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
  registerUser,
  loginUser,
};
