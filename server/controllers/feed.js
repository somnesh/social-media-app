const { recommendPosts } = require("./recommendation");

const PostView = require("../models/PostView");
const Follower = require("../models/Follower");
const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const Dislike = require("../models/Dislike");
const Like = require("../models/Like");
const Poll = require("../models/Poll");

// const generateFeed = async (req, res) => {
//   const userId = req.user;
//   try {
//     // Step 1: Get viewed post IDs
//     let viewedPostIds = await PostView.find({ user_id: userId }).select(
//       "post_id -_id"
//     );
//     viewedPostIds = viewedPostIds.map((id) => id.post_id);

//     // Step 2: Get recommended posts
//     const { recommendedPosts, recommendedPostIds } = await recommendPosts(
//       userId,
//       viewedPostIds
//     );

//     const discardPost = [...viewedPostIds, ...Array.from(recommendedPostIds)];

//     // Step 3: Fetch posts from followed users
//     const followedUsers = await Follower.find({ follower: userId }).select(
//       "followed"
//     );
//     const followedUserIds = followedUsers.map((follow) => follow.followed);

//     const followedPosts = await Post.find({
//       user_id: { $in: followedUserIds },
//       _id: { $nin: discardPost },
//       visibility: { $in: ["public", "friends"] },
//     })
//       .populate([
//         {
//           path: "user_id",
//           select: "name avatar avatarBg username",
//         },
//         {
//           path: "parent",
//           select: "content image_url user_id media_type visibility createdAt",
//           populate: {
//             path: "user_id",
//             select: "name avatar avatarBg username",
//           },
//         },
//         {
//           path: "poll_id",
//         },
//       ])
//       .sort({ createdAt: -1 });

//     // Step 4: Combine post IDs for liked posts check
//     const postIds = [
//       ...followedPosts.map((post) => post._id.toString()),
//       ...recommendedPostIds,
//     ];

//     // Step 5: Check liked posts
//     const likedPosts = await Like.find({
//       post_id: { $in: postIds },
//       user_id: userId,
//     }).select("post_id -_id");

//     const likedPostIds = likedPosts.map((like) => like.post_id.toString());

//     // Step 6: Add poll voting details and isLiked flag
//     const followedPostsWithDetails = await Promise.all(
//       followedPosts.map(async (post) => {
//         const postObj = post.toObject();

//         if (postObj.poll_id) {
//           const poll = await Poll.findById(postObj.poll_id);
//           const voter = poll.voters.find(
//             (v) => v.userId.toString() === userId._id.toString()
//           );
//           postObj.poll_id = {
//             ...poll.toObject(),
//             userVote: voter ? voter.selectedOptionIndex : null,
//           };
//         }

//         return {
//           ...postObj,
//           isLiked: likedPostIds.includes(postObj._id.toString()),
//         };
//       })
//     );

//     const recommendedPostsWithDetails = await Promise.all(
//       recommendedPosts.map(async (post) => {
//         if (post.poll_id) {
//           const poll = await Poll.findById(post.poll_id);
//           const voter = poll.voters.find(
//             (v) => v.userId.toString() === userId.toString()
//           );
//           post.poll_id = {
//             ...poll.toObject(),
//             userVote: voter ? voter.selectedOptionIndex : null,
//           };
//         }

//         return {
//           ...post,
//           isLiked: likedPostIds.includes(post._id.toString()),
//         };
//       })
//     );

//     // Step 7: Return the feed
//     res.status(StatusCodes.OK).json({
//       followedPosts: followedPostsWithDetails,
//       recommendedPosts: recommendedPostsWithDetails,
//     });
//   } catch (error) {
//     console.error("Error fetching feed:", error);
//     res.status(500).send("something went wrong");
//   }
// };

const generateFeed = async (req, res) => {
  const userId = req.user;
  const { page = 1, limit = 5 } = req.query; // Default to page 1, 10 posts per page
  const skip = (page - 1) * limit;

  try {
    // Step 1: Get viewed post IDs
    let viewedPostIds = await PostView.find({ user_id: userId }).select(
      "post_id -_id"
    );
    viewedPostIds = viewedPostIds.map((id) => id.post_id);

    // Step 2: Get recommended posts with pagination
    const { recommendedPosts, recommendedPostIds } = await recommendPosts(
      userId,
      viewedPostIds,
      skip,
      limit
    );

    const discardPost = [...viewedPostIds, ...Array.from(recommendedPostIds)];

    // Step 3: Fetch posts from followed users with pagination
    const followedUsers = await Follower.find({ follower: userId }).select(
      "followed"
    );
    const followedUserIds = followedUsers.map((follow) => follow.followed);

    const followedPosts = await Post.find({
      user_id: { $in: followedUserIds },
      _id: { $nin: discardPost },
      visibility: { $in: ["public", "friends"] },
    })
      .populate([
        {
          path: "user_id",
          select: "name avatar avatarBg username",
        },
        {
          path: "parent",
          select: "content image_url user_id media_type visibility createdAt",
          populate: {
            path: "user_id",
            select: "name avatar avatarBg username",
          },
        },
        {
          path: "poll_id",
        },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Step 4: Combine post IDs for liked posts check
    const postIds = [
      ...followedPosts.map((post) => post._id.toString()),
      ...recommendedPostIds,
    ];

    // Step 5: Check liked posts
    const likedPosts = await Like.find({
      post_id: { $in: postIds },
      user_id: userId,
    }).select("post_id -_id");

    const likedPostIds = likedPosts.map((like) => like.post_id.toString());

    // Step 6: Add poll voting details and isLiked flag
    const followedPostsWithDetails = await Promise.all(
      followedPosts.map(async (post) => {
        const postObj = post.toObject();

        if (postObj.poll_id) {
          const poll = await Poll.findById(postObj.poll_id);
          const voter = poll.voters.find(
            (v) => v.userId.toString() === userId._id.toString()
          );
          postObj.poll_id = {
            ...poll.toObject(),
            userVote: voter ? voter.selectedOptionIndex : null,
          };
        }

        return {
          ...postObj,
          isLiked: likedPostIds.includes(postObj._id.toString()),
        };
      })
    );

    const recommendedPostsWithDetails = await Promise.all(
      recommendedPosts.map(async (post) => {
        if (post.poll_id) {
          const poll = await Poll.findById(post.poll_id);
          const voter = poll.voters.find(
            (v) => v.userId.toString() === userId.toString()
          );
          post.poll_id = {
            ...poll.toObject(),
            userVote: voter ? voter.selectedOptionIndex : null,
          };
        }

        return {
          ...post,
          isLiked: likedPostIds.includes(post._id.toString()),
        };
      })
    );

    // Step 7: Return the paginated feed
    res.status(StatusCodes.OK).json({
      followedPosts: followedPostsWithDetails,
      recommendedPosts: recommendedPostsWithDetails,
      hasMore: followedPosts.length + recommendedPosts.length !== 0, // Check if there are more posts
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    res.status(500).send("something went wrong");
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
