const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

// For admin
const getAllUsers = async (req, res) => {
  res.send("Get all users");
};

// For users
const getUserDetails = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId).select("-password -phone_no -__v");
  if (!user) {
    throw new NotFoundError(`user with id:'${userId}' not found`);
  }
  res.status(StatusCodes.OK).json(user);
};

const uploadProfilePicture = async (req, res) => {
  res.send("profile picture upload");
};

const updateUserDetails = async (req, res) => {
  res.send("Update user details");
};

const deleteUser = async (req, res) => {
  res.send("delete user");
};

module.exports = {
  getAllUsers, // For admin
  getUserDetails,
  uploadProfilePicture,
  updateUserDetails,
  deleteUser,
};
