const mongoose = require("mongoose");
// ## Attributes
// follower_id
// followed_id
// timestamps

const FollowerSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    followed: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Add a compound unique index to prevent duplicate follow relationships
FollowerSchema.index({ follower: 1, followed: 1 }, { unique: true });

module.exports = mongoose.model("Follower", FollowerSchema);
