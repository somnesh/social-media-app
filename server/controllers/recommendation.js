const natural = require("natural");
const cosineSimilarity = require("compute-cosine-similarity");

const Post = require("../models/Post");
const Similarity = require("../models/Similarity"); // New Model for Similarity

const calculateAndStoreSimilarity = async () => {
  const posts = await Post.find({}).select("-createdAt -updatedAt -__v");

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

  similarityData.forEach((doc) => {
    doc.similar_posts.sort((a, b) => b.similarity_score - a.similarity_score); // Sorting descending by similarity_score
  });

  // Step 4: Clear old similarity data
  await Similarity.deleteMany({});

  // Step 5: Insert the new similarity data into MongoDB
  await Similarity.insertMany(similarityData);

  console.log("Similarity data inserted successfully.");
};

const recommendPosts = async (viewedPostIds) => {
  try {
    const similarPosts = await Similarity.find({
      post_id: { $in: viewedPostIds },
    });

    // Extract similar post IDs
    const recommendedPostIds = new Set();
    similarPosts.forEach((doc) => {
      doc.similar_posts.forEach((similarPost) => {
        if (!viewedPostIds.includes(similarPost.post_id.toString())) {
          recommendedPostIds.add(similarPost.post_id.toString());
        }
      });
    });

    // Fetch the recommended posts
    const recommendedPosts = await Post.find({
      _id: { $in: Array.from(recommendedPostIds) },
    });

    return recommendedPosts;
  } catch (error) {
    console.error("Error recommending posts:", error);
    return [];
  }
};

module.exports = { calculateAndStoreSimilarity, recommendPosts };
