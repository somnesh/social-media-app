require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const mongoose = require("mongoose");

async function cleanAndParseMongoResponse(responseString) {
  try {
    // Step 1: Remove escape characters
    const cleanedString = responseString
      .replace(/\\n/g, "") // Remove newline escape
      .replace(/\\"/g, '"') // Replace escaped quotes
      .trim();

    // Step 2: Replace ObjectId(...) with a valid representation
    const replacedString = cleanedString.replace(
      /ObjectId\((.*?)\)/g,
      (_, id) => `{"$oid": ${id}}`
    );

    // Step 3: Parse the cleaned and replaced string into a JavaScript object
    const parsedObject = JSON.parse(replacedString);

    // Step 4: Convert "$oid" fields to Mongoose ObjectId
    if (parsedObject._id && parsedObject._id.$oid) {
      parsedObject._id = new mongoose.Types.ObjectId(parsedObject._id.$oid);
      delete parsedObject._id.$oid; // Clean up the temporary field
    }

    return parsedObject; // Return the formatted JavaScript object
  } catch (error) {
    console.error("Failed to parse the response:", error.message);
    return null; // Return null if parsing fails
  }
}

const getQueryFromGemini = async (collectionName, userQuery) => {
  const GEMINI_API = process.env.GEMINI_API_KEY;

  const genAI = new GoogleGenerativeAI(GEMINI_API);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Instruction: Convert the following natural language query into a complete and valid MongoDB query. Ensure the query doesn't includes the db.${collectionName}.method() structure and adheres to MongoDB's syntax. Return only the query itself as plain text without any formatting markers or comments.

User Input: ${userQuery}`;

  const result = await model.generateContent(prompt);
  console.log(result.response.text());

  const formattedResult = await cleanAndParseMongoResponse(
    result.response.text()
  );
  return formattedResult;
};

module.exports = { getQueryFromGemini };
