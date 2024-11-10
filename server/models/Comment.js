const mongoose = require("mongoose");
// Attributes:
// post_id
// user_id (FK)
// content
// replyCounter
// parent
// timestamp

const CommentSchema = new mongoose.Schema(
  {
    post_id: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: [true, "Please provide post id"],
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user id"],
    },
    content: {
      type: String,
      maxlength: 100,
      require: true,
    },
    like_counter: {
      type: Number,
      default: 0,
    },
    reply_counter: {
      type: Number,
      default: 0,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
    notification_id: {
      type: mongoose.Types.ObjectId,
      ref: "Notification",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
