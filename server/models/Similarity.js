const mongoose = require("mongoose");

const SimilaritySchema = new mongoose.Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
    unique: true,
  },
  similar_posts: [
    {
      post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
      },
      similarity_score: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Similarity", SimilaritySchema);
