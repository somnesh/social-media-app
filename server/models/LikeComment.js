const mongoose = require("mongoose");
// ## Attributes
// comment_id
// user_id
// timestamps

const LikeCommentSchema = new mongoose.Schema(
  {
    comment_id: {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
      required: [true, "Please provide comment id"],
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user id"],
    },
    notification_id: {
      type: mongoose.Types.ObjectId,
      ref: "Notification",
      required: [true, "Please provide notification id"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LikeComment", LikeCommentSchema);
