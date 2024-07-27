const mongoose = require("mongoose");

// ## Attributes
// user_id
// content
// image_url

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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
