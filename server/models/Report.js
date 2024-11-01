const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user id"],
    },
    reported_content_id: {
      type: mongoose.Types.ObjectId,
      required: [true, "Please provide id"],
    },
    content_type: {
      type: String,
      enum: {
        values: ["post", "comment", "user"],
        message: "{VALUE} is not supported",
      },
      require: [true, "please provide content type"],
    },
    report_content: {
      type: String,
      maxlength: 100,
      require: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
