const User = require("../models/User");
const Post = require("../models/Post");
const Report = require("../models/Report");
const { StatusCodes } = require("http-status-codes");

const {
  BadRequestError,
  UnauthenticatedError,
  AccessDeniedError,
  NotFoundError,
} = require("../errors");
const { default: mongoose } = require("mongoose");
const { getQueryFromGemini } = require("../services/GenerateDBQuery");
const sendEmail = require("../utils/sendEmail");
const cloudinary = require("cloudinary").v2;

const collectionList = {
  Savedpost: "SavedPost",
  Postview: "PostView",
  Maintenanceconfig: "MaintenanceConfig",
  Likecomment: "LikeComment",
};

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
      .select("name email role refreshToken isSuspended suspensionReason"); // Select only relevant fields

    const totalUsers = await User.countDocuments(); // Total user count

    // Add status field based on the presence of refreshToken
    const usersWithStatus = users.map((user) => {
      const { refreshToken, ...userWithoutToken } = user._doc; // Destructure to exclude refreshToken
      return {
        ...userWithoutToken,
        status: refreshToken ? "Active" : "Inactive", // Determine status based on refreshToken
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

const deleteUser = async (req, res) => {
  res.send("delete user");
};

const getContentModerationData = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortOrder = "desc",
  } = req.query;
  const skip = (page - 1) * limit;

  const sortOptions = {
    [sortField]: sortOrder === "asc" ? 1 : -1,
  };

  // Aggregation pipeline
  const posts = await Post.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId("111111111111111111111111") },
      },
    },
    {
      $lookup: {
        from: "reports", // The name of the Report collection
        localField: "_id",
        foreignField: "reported_content_id",
        as: "reports",
      },
    },
    {
      $addFields: {
        reportCount: {
          $size: {
            $filter: {
              input: "$reports",
              as: "report",
              cond: { $eq: ["$$report.content_type", "post"] },
            },
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "userDetails",
      },
    },
    {
      $unwind: {
        path: "$userDetails",
        preserveNullAndEmptyArrays: true, // In case user details are not found
      },
    },
    {
      $project: {
        _id: 1,
        image_url: 1,
        content: 1,
        media_type: 1,
        createdAt: 1,
        reportCount: 1,
        user: {
          _id: "$userDetails._id",
          name: "$userDetails.name",
          avatar: "$userDetails.avatar",
          username: "$userDetails.username",
        },
      },
    },
    { $sort: sortOptions },
    { $skip: skip },
    { $limit: parseInt(limit) },
  ]);

  // Total post count excluding the specified ID
  const totalPosts = await Post.countDocuments({
    _id: { $ne: new mongoose.Types.ObjectId("111111111111111111111111") },
  });

  res.status(200).json({
    posts: posts,
    totalPages: Math.ceil(totalPosts / limit),
    currentPage: parseInt(page),
  });
};

const deletePostMedia = async (req, res) => {
  const { postId } = req.params;
  const user = req.user;

  if (user.role !== "admin") {
    throw new AccessDeniedError(
      "You don't have the access to use this feature"
    );
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const post = await Post.findById(postId, {}, { session });

  if (post.media_type !== "text" && post.image_url) {
    const publicId = post.image_url.split("/").slice(-2)[1].split(".")[0];

    await cloudinary.uploader.destroy(publicId, {
      resource_type: post.media_type,
    });
  }

  await Post.updateOne(
    { _id: postId },
    { $set: { image_url: null, media_type: "text" } },
    { session }
  );

  await session.commitTransaction();
  session.endSession();
  res.status(StatusCodes.OK).json({ success: true, msg: "Media deleted" });
};

const getCollectionList = async (req, res) => {
  // Access the MongoDB connection directly from Mongoose
  const db = mongoose.connection.db;

  // Fetch the list of collections
  const collections = await db.listCollections().toArray();

  // Extract collection names
  const collectionNames = collections.map((collection) => collection.name);

  // Send the list of collection names as the response
  res.status(200).json({ collections: collectionNames });
};

const generateQueryResponseFromGemini = async (req, res) => {
  // const userQuery = "Show me the user with user id 67358705186fff15c538bf1d";
  // const collection = "users";

  const { userQuery, collection } = req.query;
  console.log(userQuery, collection);

  const result = await getQueryFromGemini(collection, userQuery);
  console.log("result: ", result);
  // const Model = mongoose.model("YourModelName");
  console.log(collectionList[collection]);
  // const getModel = ;
  const Model = mongoose.model(collectionList[collection] || collection);
  const test = await Model.find(result).select("-password -refreshToken");

  res.status(StatusCodes.OK).json(test);
};

const suspendUser = async (req, res) => {
  const { id: userId } = req.params;
  const { reason } = req.body;

  const response = await User.findOneAndUpdate(
    { _id: userId },
    { isSuspended: true, suspensionReason: reason, refreshToken: null },
    { new: true }
  );

  if (!response) {
    throw new NotFoundError("User not found");
  }

  const message = `
<p>Dear ${response.name.split(" ")[0]},</p>

<p>We regret to inform you that your account on Connectify has been temporarily suspended . This decision was made due to a violation of our Community Guidelines.</p>

<p><b>Reason for Suspension:</b> ${reason}</p>

<p>During this period, you will not be able to access your account or any of its associated features.</p>

<p>If you believe this suspension was applied in error or if you wish to appeal the decision, please reach out to us by replying to this email or contacting our support team at <a href="cu360rent@gmail.com">cu360rent@gmail.com</a>. Include any relevant information or evidence to support your appeal.</p>

<p>We value your presence in our community and encourage you to familiarize yourself with our Community Guidelines to ensure a positive experience for all members.</p>

<p>Thank you for your understanding.</p><br>

<p>Best regards,</p>
<p>Connectify Support Team</p>
    
  `;

  await sendEmail({
    to: response.email,
    subject: "Account Suspension Notification",
    html: message,
  });

  res.status(StatusCodes.OK).json({ success: true, msg: "User suspended" });
};

const revokeSuspension = async (req, res) => {
  const { id: userId } = req.params;

  const response = await User.findOneAndUpdate(
    { _id: userId },
    { isSuspended: false, suspensionReason: null },
    { new: true }
  );

  if (!response) {
    throw new NotFoundError("User not found");
  }
  const message = `
<p>Dear ${response.name.split(" ")[0]},</p>

<p>We’re happy to inform you that the suspension on your account has been revoked. You can now access your account and resume using Connectify.</p>

<p>Thank you for your cooperation. If you have any questions, feel free to contact us at <a href="cu360rent@gmail.com">cu360rent@gmail.com</a></p>

<p>Best regards,</p>
<p>Connectify Support Team</p>
    
  `;

  await sendEmail({
    to: response.email,
    subject: "Account Suspension Revoked",
    html: message,
  });

  res.status(StatusCodes.OK).json({ success: true, msg: "Suspension revoked" });
};

module.exports = {
  adminLogin,
  getDashboard,
  userManagement,
  logout,
  getContentModerationData,
  deletePostMedia,
  getCollectionList,
  generateQueryResponseFromGemini,
  suspendUser,
  revokeSuspension,
};
