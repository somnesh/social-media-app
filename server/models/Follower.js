const mongoose = require("mongoose");
// ## Attributes
// follower_id
// followed_id
// timestamps

const FollowerSchema = new mongoose.Schema(
  {
    follower_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
    followed_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Follower", FollowerSchema);
