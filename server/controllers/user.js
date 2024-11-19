const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const Follower = require("../models/Follower");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { sendNotification } = require("./notification");
const sendResetEmail = require("../utils/sendResetEmail");
const encryptId = require("../utils/encryptId");

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

    if (req.user && user[0]._id.toString() !== req.user._id.toString()) {
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
  const userId = req.params.idOrUsername;
  console.log(userId);

  const validateUser = await User.findById(userId);
  if (validateUser._id.toString() !== userId) {
    throw new BadRequestError("User doesn't have permission to perform this.");
  }

  const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
    runValidators: true,
  });

  res.status(200).json({ success: true });
};

const forgotPassword = async (req, res) => {
  const { email } = req.params;
  const user = await User.findOne({ email: email }); // User is already authenticated and available

  if (!user) {
    throw new NotFoundError(`No user is found with email id: ${email}`);
  }

  try {
    // Step 1: Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.RESET_PASSWORD_TOKEN_SECRET,
      { expiresIn: process.env.RESET_PASSWORD_TOKEN_SECRET_EXPIRATION }
    );

    // Step 2: Update the user's reset token and expiration time
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires =
      Date.now() + process.env.RESET_PASSWORD_TOKEN_SECRET_EXPIRATION * 1000; // Set expiration timestamp
    await user.save();

    const origin = process.env.API_URL;

    const name = user.name;
    const email = user.email;
    await sendResetEmail({
      name,
      email,
      resetToken,
      origin,
    });

    // Step 5: Respond to the client
    res.status(200).json({
      message: "Password reset link has been sent to your email address.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyResetPassword = async (req, res) => {
  try {
    const { token: resetPasswordToken, email } = req.query;
    const user = await User.findOne({
      email: email,
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      throw new UnauthenticatedError(
        "Verification Failed: Invalid or expired token."
      );
    }

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    const encryptedUserId = encryptId(user._id.toString());

    res.redirect(
      `${process.env.CLIENT_URL}/reset-password-success/${encryptedUserId}`
    );
  } catch (error) {
    console.error(error);
    res.redirect(`${process.env.CLIENT_URL}/500`);
  }
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
  forgotPassword,
  verifyResetPassword,
};
