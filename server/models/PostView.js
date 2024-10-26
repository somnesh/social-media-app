const mongoose = require("mongoose");

const PostViewSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  view_count: { type: Number, default: 1 },
});

module.exports = mongoose.model("PostView", PostViewSchema);
