const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Follower = require("../models/Follower");
const { default: mongoose } = require("mongoose");

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

const followUser = async (req, res) => {
  const followerId = req.user; // User who is following (from authenticated user)
  const followedId = req.params.id; // User being followed (from request parameter)

  if (!followerId || !followedId) {
    throw new BadRequestError("Follower and Followed user cannot be empty");
  }

  if (followerId === followedId) {
    throw new BadRequestError("Follower and Followed user cannot be the same");
  }

  // Check if the follow relationship already exists
  const existingFollow = await Follower.findOne({
    follower: followerId,
    followed: followedId,
  });

  if (existingFollow) {
    throw new BadRequestError("You are already following this user");
  }

  // Create a new follow relationship
  const follow = await Follower.create({
    follower: followerId,
    followed: followedId,
  });

  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Successfully followed the user",
    follow,
  });
};

const unfollowUser = async (req, res) => {
  const followerId = req.user; // User who is unfollowing
  const followedId = req.params.id; // User being unfollowed

  if (!followerId || !followedId) {
    throw new BadRequestError("Follower and Followed user cannot be empty");
  }

  // Check if the follow relationship exists
  const follow = await Follower.findOne({
    follower: followerId,
    followed: followedId,
  });

  if (!follow) {
    throw new BadRequestError("You are not following this user");
  }

  // Delete the follow relationship
  await Follower.deleteOne({ _id: follow._id });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Successfully unfollowed the user.",
  });
};

module.exports = {
  getAllUsers, // For admin
  getUserDetails,
  uploadProfilePicture,
  updateUserDetails,
  deleteUser,
  followUser,
  unfollowUser,
};
