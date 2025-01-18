const mongoose = require("mongoose");

// ## Attributes
// user_id
// content
// image_url
// visibility
// interactions
//  ├── like
//  ├── comment
//  └── share
// parent

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
    parent: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
    poll_id: {
      type: mongoose.Types.ObjectId,
      ref: "Poll",
    },
    media_type: {
      type: String,
      default: "text",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
