const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const Follower = require("../models/Follower");
const { StatusCodes } = require("http-status-codes");
const {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
} = require("../errors");
const { default: mongoose } = require("mongoose");
const Interaction = require("../models/Interaction");
const PostView = require("../models/PostView");
const SavedPost = require("../models/SavedPost");
const LikeComment = require("../models/LikeComment");
const Notification = require("../models/Notification");
const { sendNotification } = require("./notification");
const encryptId = require("../utils/encryptId");
const { getPoll } = require("./Poll");
const Poll = require("../models/Poll");
const cloudinary = require("cloudinary").v2;

const getAllPost = async (req, res) => {
  const userId = req.params.id;

  let visibility = [];
  if (userId === req.user._id.toString()) {
    visibility = ["public", "friends", "private"];
  } else {
    const isFollower = await Follower.find({
      followed: userId,
      follower: req.user._id,
    });
    if (isFollower.length !== 0) {
      visibility = ["public", "friends"];
    } else {
      visibility = ["public"];
    }
  }

  const posts = await Post.find({
    user_id: userId,
    visibility: { $in: visibility },
  })
    .populate([
      {
        path: "user_id", // Populate user details from the user_id field
        select: "name avatar avatarBg username", // Only select name and avatar from the user
      },
      {
        path: "parent", // Populate the parent post if it exists
        select: "content image_url user_id visibility createdAt media_type", // Select relevant fields from the parent post
        populate: {
          path: "user_id", // Populate user details of the parent post
          select: "name avatar avatarBg username", // Select name and avatar for the parent post's user
        },
      },
      {
        path: "poll_id",
      },
    ])
    .sort({ createdAt: -1 });

  if (!posts) {
    throw new NotFoundError(`No post found`);
  }

  for (const post of posts) {
    if (post.parent) {
      if (post.parent.visibility === "private") {
        post.parent = { _id: "111111111111111111111111" };
      } else if (post.parent.visibility === "friends") {
        const isFollower = await Follower.exists({
          follower: req.user, // Current user
          followed: post.parent.user_id._id, // Parent post's user
        });
        if (!isFollower) {
          post.parent = { _id: "111111111111111111111111" };
        }
      }
    }
  }

  const postIds = [...posts.map((post) => post._id.toString())];

  const likedPosts = await Like.find({
    post_id: { $in: postIds },
    user_id: userId,
  }).select("post_id -_id");

  const likedPostIds = likedPosts.map((like) => like.post_id.toString());

  const postsWithPollData = await Promise.all(
    posts.map(async (post) => {
      const postObj = post.toObject();

      // If the post has a poll, add userVote under poll_id
      if (postObj.poll_id) {
        const poll = await Poll.findById(postObj.poll_id);
        const voter = poll.voters.find(
          (v) => v.userId.toString() === req.user._id.toString()
        );
        postObj.poll_id = {
          ...poll.toObject(),
          userVote: voter ? voter.selectedOptionIndex : null,
        };
      }

      return {
        ...postObj,
        isLiked: likedPostIds.includes(post._id.toString()),
      };
    })
  );

  res
    .status(StatusCodes.OK)
    .json({ count: posts.length, posts: postsWithPollData });
};

const createPost = async (req, res) => {
  if (!req.body.image_url && req.body.content == "") {
    throw new BadRequestError("Both content and image field cannot be empty!");
  }

  req.body.user_id = req.user.userId;

  let post = await Post.create(req.body);
  post = await post.populate({
    path: "user_id",
    select: "name avatar avatarBg username",
  });
  res.status(StatusCodes.CREATED).json({ post });
};

const getPostDetails = async (req, res) => {
  const userId = req.user;
  const postId = req.params.id;

  let post = await Post.findById(postId).populate([
    {
      path: "user_id", // Populate user details from the user_id field
      select: "name avatar avatarBg username", // Only select name and avatar from the user
    },
    {
      path: "parent", // Populate the parent post if it exists
      select: "content image_url user_id visibility media_type createdAt", // Select relevant fields from the parent post
      populate: {
        path: "user_id", // Populate user details of the parent post
        select: "name avatar avatarBg username", // Select name and avatar for the parent post's user
      },
    },
  ]);
  let contentType = "post";
  let pollDetails;
  if (post.poll_id) {
    contentType = "poll";
    pollDetails = await getPoll(post.poll_id, userId);
  }

  const isPostLiked = await Like.find({
    post_id: postId,
    user_id: userId,
  });

  let isLiked = false;

  if (isPostLiked.length !== 0) {
    isLiked = true;
  }

  if (!post) {
    throw new NotFoundError(`No post with id: ${postId}`);
  }

  if (
    !req.user &&
    (post.visibility !== "public" || post.parent.visibility !== "public")
  ) {
    throw new UnauthenticatedError("You need to login first.");
  }

  if (
    post.visibility === "private" &&
    post.user_id._id.toString() !== req.user._id.toString()
  ) {
    throw new UnauthenticatedError(
      "User doesn't have permission to perform this action."
    );
  }

  if (contentType === "post" && post.parent) {
    if (post.parent.visibility === "private") {
      post.parent = { _id: "111111111111111111111111" };
    } else if (post.parent.visibility === "friends") {
      const isFollower = await Follower.exists({
        follower: req.user, // Current user
        followed: post.parent.user_id._id, // Parent post's user
      });
      if (!isFollower) {
        post.parent = { _id: "111111111111111111111111" };
      }
    }
  }

  res.status(StatusCodes.OK).json({
    post: {
      ...post.toObject(),
      contentType,
      isLiked: isLiked,
      poll_id: pollDetails,
    },
  });
};

const updatePost = async (req, res) => {
  const {
    params: { id: postId },
    user: { userId },
  } = req;

  const post = await Post.findOneAndUpdate(
    { _id: postId, user_id: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!post) {
    throw new NotFoundError(
      `The user ${req.user.name} has no post with id: ${postId}`
    );
  }
  res.status(StatusCodes.OK).json({ post });
};

const deletePost = async (req, res) => {
  const {
    params: { id: postId },
    user: { userId },
  } = req;

  // start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let post;
    if (req.user.role !== "admin") {
      post = await Post.findOneAndDelete({ _id: postId, user_id: userId });
    } else {
      post = await Post.findOneAndDelete({ _id: postId });
    }

    if (!post) {
      throw new NotFoundError(
        `The user ${req.user.name} has no post with id: ${postId}`
      );
    }

    if (post.poll_id) {
      await Poll.findByIdAndDelete(post.poll_id);
    }

    // delete likes along with their notifications
    const likesToDelete = await Like.find({ post_id: postId });
    const likeIdsToDelete = likesToDelete.map((like) => like._id) || [];

    let notificationToDelete =
      likesToDelete.map((like) => like.notification_id) || [];

    await Like.deleteMany({ _id: { $in: likeIdsToDelete } }, { session });
    // delete comments along with their notifications
    const commentsToDelete = await Comment.find({ post_id: postId });
    const commentIdsToDelete =
      commentsToDelete.map((comment) => comment._id) || [];

    const commentNotificationIds =
      commentsToDelete.map((comment) => comment.notification_id) || [];

    await Comment.deleteMany({ _id: { $in: commentIdsToDelete } }, { session });

    notificationToDelete = [...notificationToDelete, ...commentNotificationIds];

    await Notification.deleteMany(
      { _id: { $in: notificationToDelete } },
      { session }
    );

    await SavedPost.deleteMany({ post_id: postId }, { session });

    // add a flag to parent field of the posts where the parent post is this post
    await Post.updateMany(
      { parent: post._id },
      { parent: "111111111111111111111111" },
      { session }
    );

    // delete media from cloudinary if any
    if (post.media_type !== "text" && post.image_url) {
      const publicId = post.image_url.split("/").slice(-2)[1].split(".")[0];

      await cloudinary.uploader.destroy(publicId, {
        resource_type: post.media_type,
      });
    }
    // commit the transaction
    await session.commitTransaction();
    session.endSession();
    res.status(StatusCodes.OK).json({ post });
  } catch (error) {
    // if any failure occurs abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res.status(500).json({ success: false, message: "Failed to delete post" });
  }
};

// this function handles the counters and its associated records by incrementing or decrementing appropriate counters and deleting or creating additional records
const updatePostInteraction = async (
  userId,
  postId,
  interactionType, // type: string, ["like", "comment", "share"]
  incr, // type: boolean, true: increment | false: decrement
  session,
  count = 1
) => {
  // Check if interactionType is valid
  if (!["like", "comment", "share"].includes(interactionType)) {
    throw new BadRequestError("Invalid interaction type");
  }
  const incValue = incr ? count : -count;

  // Update the interaction count
  const post = await Post.updateOne(
    { _id: postId }, // Find the post by its ID
    { $inc: { [`interactions.${interactionType}`]: incValue } }, // Increment or decrement the specified interaction
    { session }
  );

  if (incr) {
    await Interaction.create(
      [
        {
          user_id: userId,
          interactions: [
            { post_id: postId, interaction_type: interactionType },
          ],
        },
      ],
      { session }
    );
  } else {
    await Interaction.deleteOne(
      {
        user_id: userId,
        "interactions.post_id": postId,
        "interactions.interaction_type": interactionType,
      },
      { session }
    );
  }

  if (post.nModified === 0) {
    throw new BadRequestError("Post not found or no changes made");
  }
};

const likePost = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user;
  const io = req.io;
  const { receiverId, postLink } = req.body;

  if (!postId || !userId) {
    throw new BadRequestError("User id or Post id cannot be empty");
  }

  const doesPostExists = await Post.findById(postId);
  if (!doesPostExists) {
    throw new BadRequestError(`No Post found with id: ${postId}`);
  }

  const doesLikeExists = await Like.find({ post_id: postId, user_id: userId });

  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    if (doesLikeExists.length !== 0) {
      const deletedLike = await Like.findOneAndDelete(
        { post_id: postId, user_id: userId },
        { session }
      );
      await Notification.deleteOne(
        { _id: deletedLike.notification_id },
        { session }
      );

      await updatePostInteraction(userId, postId, "like", false, session);
      await PostView.deleteOne(
        { user_id: userId, post_id: postId },
        { session }
      );
    } else {
      const notificationDetails = await sendNotification(
        io,
        userId,
        receiverId,
        postLink,
        "liked your post.",
        session
      );

      await Like.create(
        [
          {
            post_id: postId,
            user_id: userId,
            notification_id: notificationDetails?._id || null,
          },
        ],
        { session }
      );
      await updatePostInteraction(userId, postId, "like", true, session);
      await PostView.create([{ user_id: userId, post_id: postId }], {
        session,
      });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: {
        dislike: doesLikeExists.length !== 0,
        like: !(doesLikeExists.length !== 0),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res.status(500).json({ success: false, message: "Failed to like post" });
  }
};

const getLikes = async (req, res) => {
  const { id: postId } = req.params;

  const likes = await Like.find({ post_id: postId })
    .populate("user_id", "name avatar avatarBg")
    .lean();

  const formattedLikes = likes.map((like) => {
    return {
      ...like,
      user: like.user_id, // Rename 'user_id' to 'user'
      user_id: undefined, // remove the original 'user_id' field
    };
  });

  res.status(StatusCodes.OK).json(formattedLikes);
};

const addComment = async (req, res) => {
  const { id: postId } = req.params;
  const commentContent = req.body.content;
  const userId = req.user;
  const io = req.io;
  const { receiverId, postLink } = req.body;

  if (!commentContent || !userId || !postId) {
    throw new BadRequestError(
      "Comment content or Post id or User id cannot be empty"
    );
  }

  const doesPostExists = await Post.findById(postId);
  if (!doesPostExists) {
    throw new BadRequestError(`No Post found with id: ${postId}`);
  }

  const session = await mongoose.startSession();

  session.startTransaction();
  try {
    const notificationDetails = await sendNotification(
      io,
      userId,
      receiverId,
      postLink,
      "commented on your post.",
      session
    );
    const comment = await Comment.create(
      [
        {
          post_id: postId,
          user_id: userId,
          content: commentContent,
          notification_id: notificationDetails?._id || null,
        },
      ],
      { session }
    );
    await updatePostInteraction(userId, postId, "comment", true, session);

    await session.commitTransaction();
    session.endSession();

    const populatedComment = await Comment.findById(comment[0]._id)
      .populate({
        path: "user_id", // Populate the user details from user_id
        select: "_id name avatar", // Only select _id, name, and avatar
      })
      .lean(); // Returns plain JavaScript object

    // Rename user_id to user
    populatedComment.user = populatedComment.user_id;
    delete populatedComment.user_id;

    res.status(200).json({ success: true, comment: populatedComment });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};

const getComments = async (req, res) => {
  const { id: postId } = req.params;
  const { limit = 4, skip = 0 } = req.query;
  const userId = req.user;

  const comments = await Comment.find({ post_id: postId, parent: null })
    .populate("user_id", "name avatar username")
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .lean();

  const commentIds = [...comments.map((comment) => comment._id.toString())];

  const likedComments = await LikeComment.find({
    comment_id: { $in: commentIds },
    user_id: userId,
  });

  const likedCommentIds = likedComments.map((like) =>
    like.comment_id.toString()
  );

  let formattedComments = comments.map((comment) => {
    return {
      ...comment,
      user: comment.user_id, // Rename 'user_id' to 'user'
      user_id: undefined, // remove the original 'user_id' field
      isLiked: likedCommentIds.includes(comment._id.toString()),
    };
  });
  formattedComments[0].content_type = "comment";
  res.status(StatusCodes.OK).json(formattedComments);
};

const replyComment = async (req, res) => {
  const { id: parentComment } = req.params;
  const userId = req.user;
  const commentContent = req.body.content;

  const io = req.io;
  const { receiverId, postLink } = req.body;

  const comment = await Comment.findById(parentComment);

  if (!comment) {
    throw new NotFoundError("Comment not found");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const notificationDetails = await sendNotification(
      io,
      userId,
      receiverId,
      postLink,
      "replied to your comment.",
      session
    );
    const data = [
      {
        post_id: comment.post_id,
        user_id: userId,
        content: commentContent,
        parent: comment._id,
        notification_id: notificationDetails?._id || null,
      },
    ];

    const reply = await Comment.create(data, { session });

    // Populate the user_id field with name and avatar
    await reply[0].populate("user_id", "name avatar username");

    await updatePostInteraction(
      userId,
      comment.post_id,
      "comment",
      true,
      session
    );

    await Comment.findByIdAndUpdate(
      parentComment,
      { $inc: { reply_counter: 1 } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    let formattedComments = {
      ...reply[0].toObject(),
      user: reply[0].user_id, // Rename 'user_id' to 'user'
      user_id: undefined, // remove the original 'user_id' field
    };

    formattedComments.contentType = "comment";
    res
      .status(StatusCodes.OK)
      .json({ success: true, reply: formattedComments });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Comment reply failed" });
  }
};

const getCommentReplies = async (req, res) => {
  const { id: commentId } = req.params; // Get the parent comment ID
  const { limit = 4, skip = 0 } = req.query;

  // Fetch replies with pagination
  const replies = await Comment.find({ parent: commentId })
    .populate("user_id", "name avatar username")
    .skip(parseInt(skip))
    .limit(parseInt(limit))
    .lean();

  if (replies.length === 0) {
    throw new NotFoundError("Comment not found");
  }

  let formattedReplies = replies.map((reply) => {
    return {
      ...reply,
      user: reply.user_id, // Rename 'user_id' to 'user'
      user_id: undefined, // remove the original 'user_id' field
      contentType: "comment",
    };
  });

  res.status(StatusCodes.OK).json(formattedReplies);
};

const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;
  const userId = req.user;

  // check if comment exists
  const isCommentExists = await Comment.findById(commentId);
  if (!isCommentExists) {
    throw new BadRequestError(`No comment exists with the id: ${commentId}`);
  }

  // check if user has permission to delete
  if (isCommentExists.user_id.toString() != userId._id.toString()) {
    throw new UnauthenticatedError(
      `The user with id:${userId._id} doesn't have the permission to perform this operation`
    );
  }

  // start a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const commentsToDelete = await Comment.find({ parent: commentId });

    const commentIdsToDelete =
      commentsToDelete.map((comment) => comment._id) || [];

    commentIdsToDelete.push(commentId); // Include the parent comment

    // Delete all the found comments
    const totalDeleted = commentIdsToDelete.length;

    await Comment.deleteMany({ _id: { $in: commentIdsToDelete } }, { session });

    if (isCommentExists.parent) {
      await Comment.findByIdAndUpdate(
        isCommentExists.parent,
        {
          reply_counter: { $inc: -1 },
        },
        { session }
      );
    }
    // decrement the comment counter by 1
    await updatePostInteraction(
      userId,
      isCommentExists.post_id,
      "comment",
      false,
      session,
      totalDeleted
    );
    let notificationToDelete = commentsToDelete.map((c) => c.notification_id);

    const likeCommentsToDelete = await LikeComment.find({
      comment_id: { $in: commentIdsToDelete },
    });

    const likeCommentsIdsToDelete =
      likeCommentsToDelete.map((likeComment) => likeComment._id) || [];

    const likeCommentsNotificationIds =
      likeCommentsToDelete.map((likeComment) => likeComment.notification_id) ||
      [];

    notificationToDelete = [
      ...notificationToDelete,
      ...likeCommentsNotificationIds,
    ];
    await LikeComment.deleteMany(
      { _id: { $in: likeCommentsIdsToDelete } },
      { session }
    );

    await Notification.deleteMany(
      { _id: { $in: notificationToDelete } },
      { session }
    );

    // commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.OK).json({
      success: true,
      comment: { _id: commentId, totalDeleted: totalDeleted },
    });
  } catch (error) {
    // if any failure occurs abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete comment" });
  }
};

const likeComment = async (req, res) => {
  const { id: commentId } = req.params;
  const userId = req.user;

  const io = req.io;
  const { receiverId, postLink } = req.body;

  const doesLikeExists = await LikeComment.find({
    comment_id: commentId,
    user_id: userId,
  });
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (doesLikeExists.length === 0) {
      await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { like_counter: 1 } },
        { new: true, session }
      );

      const notificationDetails = await sendNotification(
        io,
        userId,
        receiverId,
        postLink,
        "liked your comment.",
        session
      );

      await LikeComment.create(
        [
          {
            comment_id: commentId,
            user_id: userId,
            notification_id: notificationDetails?._id || null,
          },
        ],
        { session }
      );
    } else {
      const deletedLike = await LikeComment.findOneAndDelete(
        {
          comment_id: commentId,
          user_id: userId,
        },
        { session }
      );

      await Notification.deleteOne(
        { _id: deletedLike.notification_id },
        { session }
      );

      await Comment.findByIdAndUpdate(
        commentId,
        { $inc: { like_counter: -1 } },
        { new: true, session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.OK).json({
      success: true,
      message: {
        dislike: doesLikeExists.length !== 0,
        like: !(doesLikeExists.length !== 0),
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res.status(500).json({ success: false, message: "Failed to like post" });
  }
};

const sharePost = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user;
  req.body.user_id = userId._id;
  req.body.parent = postId;

  const io = req.io;
  const { receiverId } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const post = await Post.create([req.body], { session });
    await updatePostInteraction(userId, postId, "share", true, session);

    const postLink = `post/${encryptId(post[0]._id.toString())}`;
    await sendNotification(
      io,
      userId,
      receiverId,
      postLink,
      "shared your post.",
      session
    );
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, post });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to share the post" });
  }
};

const savePost = async (req, res) => {
  const { id: postId } = req.params;
  const userId = req.user._id;
  req.body.user_id = userId;
  req.body.post_id = postId;

  const duplicate = await SavedPost.find(req.body);

  if (duplicate.length !== 0) {
    throw new BadRequestError("Post already exists on your saved list");
  }

  const savedPost = await SavedPost.create(req.body);

  res.status(StatusCodes.CREATED).json({ success: true, savedPost });
};

const deleteSavedPost = async (req, res) => {
  const {
    params: { id: postId },
    user: { userId },
  } = req;

  const savedPost = await SavedPost.findOneAndDelete({
    post_id: postId,
    user_id: userId,
  });

  if (!savedPost) {
    throw new NotFoundError("No saved post found with the given details");
  }

  res.status(StatusCodes.OK).json({ success: true, savedPost });
};

const getSavedPosts = async (req, res) => {
  const userId = req.user;

  // const totalCount = await SavedPost.countDocuments({ user_id: userId });

  const savedPosts = await SavedPost.find({ user_id: userId })
    .populate([
      {
        path: "post_id",
        populate: [
          {
            path: "user_id", // Populate user details of the post's author
            select: "name avatar avatarBg", // Only select name, avatar, and avatarBg fields
          },
          {
            path: "parent", // Populate the parent post if it exists
            select: "content image_url user_id visibility createdAt", // Select relevant fields from the parent post
            populate: {
              path: "user_id", // Populate user details of the parent post's author
              select: "name avatar avatarBg", // Only select name, avatar, and avatarBg for the parent post's user
            },
          },
        ],
      },
    ])
    .sort({ createdAt: -1 });

  const postIds = [...savedPosts.map((post) => post.post_id._id)];
  const likedPosts = await Like.find({
    post_id: { $in: postIds },
    user_id: userId,
  });

  const likedPostIds = likedPosts.map((like) => like.post_id.toString());

  const savedPostsFinal = savedPosts.map((post) => ({
    ...post.post_id.toObject(),
    isLiked: likedPostIds.includes(post.post_id._id.toString()),
    savedPost: true,
  }));

  res.status(StatusCodes.OK).json(savedPostsFinal);
};

const updateComment = async (req, res) => {
  const { id: commentId } = req.params;
  const userId = req.user;

  const comment = await Comment.findOneAndUpdate(
    { _id: commentId, user_id: userId },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!comment) {
    throw new BadRequestError(
      "Comment not found or user doesn't have permission to perform this action"
    );
  }

  res.status(StatusCodes.OK).json({ success: true, comment });
};

module.exports = {
  getAllPost,
  createPost,
  getPostDetails,
  updatePost,
  deletePost,
  likePost,
  getLikes,
  addComment,
  getComments,
  replyComment,
  deleteComment,
  sharePost,
  savePost,
  updateComment,
  getCommentReplies,
  likeComment,
  getSavedPosts,
  deleteSavedPost,
};
