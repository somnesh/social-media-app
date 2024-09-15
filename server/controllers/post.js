const Post = require("../models/Post");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const { default: mongoose } = require("mongoose");
const Interaction = require("../models/Interaction");

const getAllPost = async (req, res) => {
  const posts = (
    await Post.find({ user_id: req.user.userId }).sort("createdAt")
  ).reverse();
  if (!posts) {
    throw new NotFoundError(`No post found`);
  }
  res.status(StatusCodes.OK).json({ count: posts.length, posts });
};

const createPost = async (req, res) => {
  const cloudinaryResponse = req.body.cloudinaryRes;

  if (!cloudinaryResponse && req.body.content == "") {
    throw new BadRequestError("Both content and image field cannot be empty!");
  }
  if (cloudinaryResponse) {
    req.body.image_url = cloudinaryResponse.secure_url;
  }
  req.body.user_id = req.user.userId;

  const post = await Post.create(req.body);
  res.status(StatusCodes.CREATED).json({ post });
};

const getPostDetails = async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post) {
    throw new NotFoundError(`No post with id: ${postId}`);
  }
  res.status(StatusCodes.OK).json({ post });
};

const updatePost = async (req, res) => {
  const {
    params: { id: postId },
    user: { userId },
    body: { content },
  } = req;
  if (!content) {
    throw new BadRequestError("Content field cannot be empty");
  }
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

  const post = await Post.findOneAndDelete({ _id: postId, user_id: userId });
  if (!post) {
    throw new NotFoundError(
      `The user ${req.user.name} has no post with id: ${postId}`
    );
  }
  res.status(StatusCodes.OK).json({ post });
};

// this function handles the counters and its associated records by incrementing or decrementing appropriate counters and deleting or creating additional records
const updatePostInteraction = async (
  userId,
  postId,
  interactionType, // type: string, ["like", "comment", "share"]
  incr, // type: boolean, true: increment | false: decrement
  session
) => {
  // Check if interactionType is valid
  if (!["like", "comment", "share"].includes(interactionType)) {
    throw new BadRequestError("Invalid interaction type");
  }

  // Update the interaction count
  const post = await Post.updateOne(
    { _id: postId }, // Find the post by its ID
    { $inc: { [`interactions.${interactionType}`]: incr ? 1 : -1 } }, // Increment or decrement the specified interaction
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
      await Like.deleteOne({ post_id: postId, user_id: userId }, { session });
      await updatePostInteraction(userId, postId, "like", false, session);
    } else {
      await Like.create([{ post_id: postId, user_id: userId }], { session });
      await updatePostInteraction(userId, postId, "like", true, session);
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message:
        doesLikeExists.length !== 0
          ? "Post dis-liked successfully"
          : "Post liked successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res.status(500).json({ success: false, message: "Failed to like post" });
  }
};

const addComment = async (req, res) => {
  const { id: postId } = req.params;
  const commentContent = req.body.content;
  const userId = req.user;

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
    await Comment.create(
      [{ post_id: postId, user_id: userId, content: commentContent }],
      { session }
    );
    await updatePostInteraction(userId, postId, "comment", true, session);

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ success: true, message: "Comment added successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res.status(500).json({ success: false, message: "Failed to add comment" });
  }
};

const replyComment = async (req, res) => {};

const deleteReply = async (req, res) => {};

const deleteComment = async (req, res) => {};

const sharePost = async (req, res) => {};

module.exports = {
  getAllPost,
  createPost,
  getPostDetails,
  updatePost,
  deletePost,
  likePost,
  addComment,
  replyComment,
  deleteReply,
  deleteComment,
  sharePost,
};
