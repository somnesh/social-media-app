const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Follower = require("../models/Follower");
const mongoose = require("mongoose");
const { sendNotification } = require("./notification");

// For admin
const getAllUsers = async (req, res) => {
  res.send("Get all users");
};

// For users
const getUserDetails = async (req, res) => {
  const idOrUsername = req.params.idOrUsername;
  let user;

  if (mongoose.Types.ObjectId.isValid(idOrUsername)) {
    user = await User.findById(idOrUsername).select(
      "-password -refreshToken -isVerified -verified -role -__v"
    );

    res.status(StatusCodes.OK).json(user);
  } else {
    user = await User.find({ username: idOrUsername }).select(
      "-password -refreshToken -isVerified -verified -role -__v"
    );

    const totalFollowers = await Follower.countDocuments({
      followed: user[0]._id,
    });

    const totalFollowing = await Follower.countDocuments({
      follower: user[0]._id,
    });

    let isFollowingUser = false;
    let userFollowingBack = false;

    if (user[0]._id.toString() !== req.user._id.toString()) {
      isFollowingUser =
        (
          await Follower.find({
            followed: req.user._id,
            follower: user[0]._id,
          })
        ).length !== 0;

      userFollowingBack =
        (
          await Follower.find({
            followed: user[0]._id,
            follower: req.user._id,
          })
        ).length !== 0;
    }

    res.status(StatusCodes.OK).json({
      user,
      totalFollowers,
      totalFollowing,
      isFollowingUser,
      userFollowingBack,
    });
  }

  if (!user) {
    const identifier = mongoose.Types.ObjectId.isValid(idOrUsername)
      ? `user with id: '${idOrUsername}'`
      : `user with username: '${idOrUsername}'`;
    throw new NotFoundError(`${identifier} not found`);
  }
};

const uploadProfilePicture = async (req, res) => {
  const cloudinaryResponse = req.body.cloudinaryRes;

  if (!cloudinaryResponse) {
    throw new BadRequestError("Image field cannot be empty!");
  }
  const avatar = cloudinaryResponse.secure_url;

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user },
    { avatar: avatar },
    { new: true }
  ).select("-password -refreshToken -isVerified -verified -role -__v");

  res.status(StatusCodes.OK).json({ success: true, updatedUser });
};

const uploadCoverPhoto = async (req, res) => {
  const cloudinaryResponse = req.body.cloudinaryRes;

  if (!cloudinaryResponse) {
    throw new BadRequestError("Image field cannot be empty!");
  }
  const coverPhoto = cloudinaryResponse.secure_url;

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user },
    { cover_photo: coverPhoto },
    { new: true }
  ).select("-password -refreshToken -isVerified -verified -role -__v");

  res.status(StatusCodes.OK).json({ success: true, updatedUser });
};

const updateUserDetails = async (req, res) => {
  res.send("Update user details");
};

const deleteUser = async (req, res) => {
  res.send("delete user");
};

const followUser = async (req, res) => {
  const followerId = req.user._id.toString(); // User who is following (from authenticated user)
  const followedId = req.params.id.toString(); // User being followed (from request parameter)

  const io = req.io;

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

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Create a new follow relationship
    const follow = await Follower.create({
      follower: followerId,
      followed: followedId,
    });
    const postLink = `user/${req.user.username}`;

    await sendNotification(
      io,
      req.user,
      followedId,
      postLink,
      "started following you.",
      session
    );
    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Successfully followed the user",
      follow,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to follow the user" });
  }
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

const getFollowerList = async (req, res) => {
  const { limit = 10, skip = 0 } = req.query;
  const userId = req.user;

  const totalCount = await Follower.countDocuments({ followed: userId._id });

  const followers = await Follower.find({ followed: userId._id })
    .populate("follower", "id name avatar profile_bio avatarBg username")
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .lean();

  const followerIds = [...followers.map((follower) => follower.follower._id)];

  const userFollowingBack = await Follower.find({
    followed: { $in: followerIds },
    follower: userId._id,
  });

  const userFollowingBackIds = userFollowingBack.map((follower) =>
    follower.followed.toString()
  );

  const finalList = followers.map((follower) => ({
    ...follower,
    followingBack: userFollowingBackIds.includes(
      follower.follower._id.toString()
    ),
  }));

  res.status(StatusCodes.OK).json({ followers: finalList, totalCount });
};

const getFollowingList = async (req, res) => {
  const { limit = 10, skip = 0 } = req.query;
  const userId = req.user;

  const totalCount = await Follower.countDocuments({ follower: userId._id });

  const following = await Follower.find({ follower: userId._id })
    .populate("followed", "id name avatar profile_bio avatarBg username")
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .lean();

  res.status(StatusCodes.OK).json({ following, totalCount });
};

const removeFollower = async (req, res) => {
  const followerId = req.params.id.toString();
  const userId = req.user._id;

  const removed = await Follower.findOneAndDelete({
    followed: userId,
    follower: followerId,
  });

  res.status(StatusCodes.OK).json({ success: true, removed });
};

const searchUser = async (req, res) => {
  const { query } = req.query;

  try {
    const users = await User.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: query,
            path: ["name", "username", "email", "phone_no"],
            fuzzy: {
              maxEdits: 2,
              prefixLength: 2,
            },
          },
        },
      },
      {
        $project: {
          password: 0,
          refreshToken: 0,
          isVerified: 0,
          verified: 0,
          role: 0,
          date_of_birth: 0,
          gender: 0,
        },
      },
      { $limit: 10 }, // Limits the results to improve performance
    ]);

    res.status(StatusCodes.OK).json(users);
  } catch (error) {
    console.error(error);
    throw new NotFoundError("No user found");
  }
};

module.exports = {
  getAllUsers, // For admin
  getUserDetails,
  uploadProfilePicture,
  updateUserDetails,
  deleteUser,
  followUser,
  unfollowUser,
  getFollowerList,
  getFollowingList,
  removeFollower,
  searchUser,
  uploadCoverPhoto,
};
