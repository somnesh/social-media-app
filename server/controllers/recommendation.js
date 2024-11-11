const natural = require("natural");
const cosineSimilarity = require("compute-cosine-similarity");

const Post = require("../models/Post");
const Similarity = require("../models/Similarity");
const Dislike = require("../models/Dislike");
const PostView = require("../models/PostView");

const calculateAndStoreSimilarity = async () => {
  const posts = await Post.find({ visibility: { $ne: "private" } }).select(
    "-createdAt -updatedAt -__v"
  );

  // Filter out posts with empty content
  const validPosts = posts.filter(
    (post) => post.content && post.content.trim().length > 0
  );

  // Initialize the TF-IDF model
  const tfidf = new natural.TfIdf();
  validPosts.forEach((post) => tfidf.addDocument(post.content));

  // Build vocabulary
  let vocabulary = [];
  tfidf.documents.forEach((doc) => {
    Object.keys(doc).forEach((term) => {
      if (!vocabulary.includes(term) && term !== "__key") {
        vocabulary.push(term);
      }
    });
  });

  // Create TF-IDF vectors for each post
  let vectors = validPosts.map((post, index) => {
    let vector = [];
    vocabulary.forEach((term) => {
      let tfidfValue = tfidf.tfidf(term, index);
      vector.push(tfidfValue);
    });
    return vector;
  });

  // Step 1: Create a map to hold similarity data for each post
  let similarityMap = {};

  vectors.forEach((vector1, i) => {
    validPosts.forEach((post1, idx) => {
      if (!similarityMap[post1._id]) {
        similarityMap[post1._id] = [];
      }
    });

    vectors.forEach((vector2, j) => {
      if (i !== j) {
        const sim = cosineSimilarity(vector1, vector2);

        if (sim > 0.2) {
          const postId = validPosts[i]._id;
          const similarPostId = validPosts[j]._id;

          // Step 2: Push the similarity score and similar post ID into the map
          similarityMap[postId].push({
            post_id: similarPostId,
            similarity_score: sim,
          });
        }
      }
    });
  });

  // Step 3: Prepare the data to be inserted into MongoDB
  let similarityData = [];
  for (const postId in similarityMap) {
    if (similarityMap[postId].length > 0) {
      similarityData.push({
        post_id: postId,
        similar_posts: similarityMap[postId],
      });
    }
  }

  // similarityData.forEach((doc) => {
  //   doc.similar_posts.sort((a, b) => b.similarity_score - a.similarity_score); // Sorting descending by similarity_score
  // });

  // Step 4: Clear old similarity data
  await Similarity.deleteMany({});

  // Step 5: Insert the new similarity data into MongoDB
  await Similarity.insertMany(similarityData);

  console.log("Similarity data inserted successfully.");
};

const recommendPosts = async (userId, viewedPostIds) => {
  try {
    // Step 1: Retrieve disliked posts by the user
    const dislikedPosts = await Dislike.find({ user_id: userId }).select(
      "post_id"
    );
    const dislikedPostIds = dislikedPosts.map((dislike) =>
      dislike.post_id.toString()
    );

    // Step 2: Retrieve posts that have been shown more than 3 times to the user
    const overShownPosts = await PostView.find({
      user_id: userId,
      view_count: { $gte: 3 },
    }).select("post_id");
    const overShownPostIds = overShownPosts.map((view) =>
      view.post_id.toString()
    );

    // Step 3: Retrieve similar posts based on the posts that the user has viewed
    const similarPosts = await Similarity.find({
      post_id: { $in: viewedPostIds },
    });

    // Step 4: Filter similar posts
    const recommendedPostIds = new Set();
    similarPosts.forEach((doc) => {
      doc.similar_posts.forEach((similarPost) => {
        const postIdStr = similarPost.post_id.toString();
        if (
          !viewedPostIds.includes(postIdStr) && // Post has not been viewed
          !dislikedPostIds.includes(postIdStr) && // Post is not disliked
          !overShownPostIds.includes(postIdStr) // Post has not been over-shown
        ) {
          recommendedPostIds.add(postIdStr);
        }
      });
    });

    // Step 5: Fetch the recommended posts based on filtered IDs
    let recommendedPosts = await Post.find({
      _id: { $in: Array.from(recommendedPostIds) },
      user_id: { $ne: userId },
      visibility: "public",
    }).populate([
      {
        path: "user_id", // Populate user details from the user_id field
        select: "name avatar avatarBg", // Only select name and avatar from the user
      },
      {
        path: "parent", // Populate the parent post if it exists
        select: "content image_url user_id visibility createdAt", // Select relevant fields from the parent post
        populate: {
          path: "user_id", // Populate user details of the parent post
          select: "name avatar avatarBg", // Select name and avatar for the parent post's user
        },
      },
    ]);

    recommendedPosts = recommendedPosts.map((post) => ({
      ...post.toObject(), // Convert the Mongoose document to a plain object
      recommended: true,
    }));

    return { recommendedPosts, recommendedPostIds };
  } catch (error) {
    console.error("Error recommending posts:", error);
    return [];
  }
};

module.exports = { calculateAndStoreSimilarity, recommendPosts };
