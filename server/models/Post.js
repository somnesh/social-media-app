const mongoose = require("mongoose");

// ## Attributes
// user_id
// content
// image_url
// visibility

const PostSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user id"],
    },
    content: {
      type: String,
      maxlength: 100,
    },
    image_url: {
      type: String,
    },
    visibility: {
      type: String,
      enum: {
        values: ["public", "friends", "private"],
        message: "{VALUE} is not supported",
      },
      default: "public",
    },
    interactions: {
      like: {
        type: Number,
        default: 0,
      },
      comment: {
        type: Number,
        default: 0,
      },
      share: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
