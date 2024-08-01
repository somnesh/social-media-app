const mongoose = require("mongoose");
// ## Attributes
// post_id
// user_id
// timestamps

const LikeSchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Like", LikeSchema);
