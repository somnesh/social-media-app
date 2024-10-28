const { recommendPosts } = require("./recommendation");

const PostView = require("../models/PostView");
const Follower = require("../models/Follower");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const Dislike = require("../models/Dislike");
const Like = require("../models/Like");

const generateFeed = async (req, res) => {
  const userId = req.user;
  try {
    let viewedPostIds = await PostView.find({ user_id: userId }).select(
      "post_id -_id"
    );
    viewedPostIds = viewedPostIds.map((id) => id.post_id);
    // Step 1: Get recommended posts
    const { recommendedPosts, recommendedPostIds } = await recommendPosts(
      userId,
      viewedPostIds
    );

    const discardPost = [...viewedPostIds, ...Array.from(recommendedPostIds)];

    // Step 2: Fetch posts from followed users
    const followedUsers = await Follower.find({ follower: userId }).select(
      "followed"
    );

    const followedUserIds = followedUsers.map((follow) => follow.followed);

    const followedPosts = await Post.find({
      user_id: { $in: followedUserIds },
      _id: { $nin: discardPost }, // Exclude already viewed posts
      visibility: { $in: ["public", "friends"] },
    })
      .populate([
        {
          path: "user_id", // Populate user details from the user_id field
          select: "name avatar", // Only select name and avatar from the user
        },
        {
          path: "parent", // Populate the parent post if it exists
          select: "content image_url user_id visibility createdAt", // Select relevant fields from the parent post
          populate: {
            path: "user_id", // Populate user details of the parent post
            select: "name avatar", // Select name and avatar for the parent post's user
          },
        },
      ])
      .sort({ createdAt: -1 });
    // Step 3: Combine post IDs for liked posts check
    const postIds = [
      ...followedPosts.map((post) => post._id.toString()),
      ...recommendedPostIds,
    ];

    // Step 4: Check if the user has liked any of these posts
    const likedPosts = await Like.find({
      post_id: { $in: postIds },
      user_id: userId,
    }).select("post_id -_id");

    const likedPostIds = likedPosts.map((like) => like.post_id.toString());

    // Step 5: Add isLiked flag to each followed and recommended post
    const followedPostsWithLikes = followedPosts.map((post) => ({
      ...post.toObject(),
      isLiked: likedPostIds.includes(post._id.toString()),
    }));

    const recommendedPostsWithLikes = recommendedPosts.map((post) => ({
      ...post,
      isLiked: likedPostIds.includes(post._id.toString()),
    }));

    // Step 6: Return the feed with posts and isLiked flag
    res.status(StatusCodes.OK).json({
      followedPosts: followedPostsWithLikes,
      recommendedPosts: recommendedPostsWithLikes,
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).send(combinedPosts);
  }
};

const logPostView = async (req, res) => {
  const userId = req.user._id;
  const postId = req.body.postId;

  const alreadyLogged = await PostView.find({
    user_id: userId,
    post_id: { $in: postId },
  }).select("post_id");

  // Increment view count for already logged posts
  if (alreadyLogged.length > 0) {
    const bulkOps = alreadyLogged.map((log) => ({
      updateOne: {
        filter: { user_id: userId, post_id: log.post_id },
        update: { $inc: { view_count: 1 } },
      },
    }));

    await PostView.bulkWrite(bulkOps);
  }

  // Convert the already logged posts into an array of post IDs
  const loggedPostIds = alreadyLogged.map((log) => log.post_id.toString());

  // Filter out the post IDs that are already logged
  const filteredPostId = postId.filter((pid) => !loggedPostIds.includes(pid));

  // Insert the new post IDs into the database
  if (filteredPostId.length > 0) {
    const newPostViews = filteredPostId.map((pid) => ({
      user_id: userId,
      post_id: pid,
      view_count: 1,
    }));

    // Insert all the new post views into the PostView collection
    await PostView.insertMany(newPostViews);
  }
  res.json({ success: true, userId, postId });
};

const dislikePostRecommendation = async (req, res) => {
  const userId = req.user._id;
  const postId = req.body.postId;

  await Dislike.create([{ user_id: userId, post_id: postId }]);
  res.json({ success: true, userId, postId });
};
module.exports = { generateFeed, logPostView, dislikePostRecommendation };
