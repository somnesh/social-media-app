const mongoose = require("mongoose");

const InteractionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interactions: [
      {
        post_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Post",
          required: true,
        },
        interaction_type: {
          type: String,
          enum: {
            values: ["like", "comment", "share"],
            message: "{VALUE} is not supported",
          },
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interaction", InteractionSchema);
