const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide sender id"],
    },
    receiver_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide receiver id"],
    },
    link: {
      type: String,
      required: [true, "Please provide link"],
    },
    message: {
      type: String,
      required: [true, "Please provide message"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
