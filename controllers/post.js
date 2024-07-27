const Post = require("../models/Post");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");

const createPost = async (req, res) => {
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
  res.send("Update post");
};

const deletePost = async (req, res) => {
  res.send("Delete post");
};

module.exports = {
  createPost,
  getPostDetails,
  updatePost,
  deletePost,
};
