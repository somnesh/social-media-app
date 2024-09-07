const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");

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
  console.log("cloudinaryRes: ", req.body.cloudinaryRes);
  const cloudinaryResponse = req.body.cloudinaryRes;
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

module.exports = {
  getAllPost,
  createPost,
  getPostDetails,
  updatePost,
  deletePost,
};
