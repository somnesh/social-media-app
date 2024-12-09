const User = require("../models/User");
const Post = require("../models/Post");
const Report = require("../models/Report");
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
  const accessToken = user.createJWT();

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  };

  res
    .status(StatusCodes.OK)
    .cookie("accessToken", accessToken, cookieOptions)
    .json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        avatarBg: user.avatarBg,
      },
      accessToken,
    });
};

const logout = async (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  };

  res
    .status(StatusCodes.OK)
    .clearCookie("accessToken", cookieOptions)
    .json({ status: "success" });
};

const getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Total Users
    const totalUsers = await User.countDocuments();

    // Total Users Last Month
    const totalUsersLastMonth = await User.countDocuments({
      createdAt: { $lte: endOfLastMonth },
    });

    const userGrowthPercentage = calculatePercentageChange(
      totalUsers,
      totalUsersLastMonth
    );

    // Active Users (users who logged in during the current month)
    const activeUsers = await User.countDocuments({
      updatedAt: { $gte: startOfCurrentMonth },
    });

    // Active Users Last Month
    const activeUsersLastMonth = await User.countDocuments({
      updatedAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
    });

    const activeUsersPercentage = calculatePercentageChange(
      activeUsers,
      activeUsersLastMonth
    );

    // New Posts in the current month
    const newPosts = await Post.countDocuments({
      createdAt: { $gte: startOfCurrentMonth },
    });

    // New Posts Last Month
    const newPostsLastMonth = await Post.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
    });

    const newPostsPercentage = calculatePercentageChange(
      newPosts,
      newPostsLastMonth
    );

    // Reports in the current month
    const reports = await Report.countDocuments({
      createdAt: { $gte: startOfCurrentMonth },
    });

    // Reports Last Month
    const reportsLastMonth = await Report.countDocuments({
      createdAt: { $gte: startOfLastMonth, $lt: startOfCurrentMonth },
    });

    const reportsPercentage = calculatePercentageChange(
      reports,
      reportsLastMonth
    );

    // User growth data (monthly)
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Recent Activity (last 5 actions)
    const recentActivity = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $sort: { createdAt: -1 },
      },
      {
        $limit: 6,
      },
      {
        $project: {
          _id: 0,
          postId: "$_id",
          user: {
            name: 1,
            avatar: 1,
            avatarBg: 1,
          },
          action: {
            $switch: {
              branches: [
                { case: { $ne: ["$content", null] }, then: "added a post" },
                { case: { $ne: ["$parent", null] }, then: "shared a post" },
                { case: { $ne: ["$poll_id", null] }, then: "created a poll" },
              ],
              default: "interacted",
            },
          },
          timeAgo: "$createdAt",
        },
      },
    ]);

    // Send response
    res.status(200).json({
      totalUsers,
      userGrowthPercentage,
      activeUsers,
      activeUsersPercentage,
      newPosts,
      newPostsPercentage,
      reports,
      reportsPercentage,
      userGrowth,
      recentActivity,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
};

// Helper function to calculate percentage change
const calculatePercentageChange = (current, previous) => {
  if (previous === 0) {
    return current > 0 ? 100 : 0; // Avoid division by zero
  }
  return (((current - previous) / previous) * 100).toFixed(1); // Rounded to 1 decimal place
};

const userManagement = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortField = "name",
      sortOrder = "asc",
    } = req.query;
    const skip = (page - 1) * limit;

    const sortOptions = {
      [sortField]: sortOrder === "asc" ? 1 : -1,
    };

    // Fetch users with pagination
    const users = await User.find()
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select("name email role refreshToken"); // Select only relevant fields

    const totalUsers = await User.countDocuments(); // Total user count

    // Add status field based on the presence of refreshToken
    const usersWithStatus = users.map((user) => {
      const { refreshToken, ...userWithoutToken } = user._doc; // Destructure to exclude refreshToken
      return {
        ...userWithoutToken,
        status: refreshToken ? "active" : "inactive", // Determine status based on refreshToken
      };
    });

    res.status(200).json({
      users: usersWithStatus,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

const deleteUser = async (req, res) => {};

module.exports = { adminLogin, getDashboard, userManagement, logout };
