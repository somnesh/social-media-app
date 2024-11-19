const { StatusCodes } = require("http-status-codes");
const { default: mongoose } = require("mongoose");
const Poll = require("../models/Poll");
const Post = require("../models/Post");

const createPoll = async (req, res) => {
  const { question, options, expiresAt } = req.body;
  const createdBy = req.user._id; // Assume user authentication is set up
  const pollOptions = options.map((option) => ({ option, votes: 0 }));

  const session = await mongoose.startSession();

  session.startTransaction();

  try {
    const [poll] = await Poll.create(
      [
        {
          question,
          options: pollOptions,
          createdBy,
          expiresAt: new Date(Date.now() + expiresAt * 24 * 60 * 60 * 1000),
        },
      ],
      { session }
    );

    const post = new Post({ user_id: createdBy, poll_id: poll._id });
    await post.save({ session });

    await post.populate([
      {
        path: "user_id",
        select: "name avatar avatarBg username",
      },
      {
        path: "poll_id",
      },
    ]);

    await session.commitTransaction();
    session.endSession();

    res.status(StatusCodes.CREATED).json({ post });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error("Transaction failed, rolling back changes", error);
    res.status(500).json({ success: false, message: "Failed to create poll" });
  }
};

const vote = async (req, res) => {
  const { pollId } = req.params;
  const { selectedOptionIndex } = req.body;
  const userId = req.user._id; // Assume user authentication is set up
  console.log("selectedOptionIndex: ", selectedOptionIndex);

  const poll = await Poll.findById(pollId);
  if (!poll) {
    return res.status(404).json({ message: "Poll not found" });
  }

  // Ensure the poll hasn't expired
  if (poll.expiresAt < new Date()) {
    return res.status(400).json({ message: "Poll has expired" });
  }

  // Check if the user has already voted
  if (poll.voters.some((voter) => voter.userId.toString() === userId)) {
    return res
      .status(403)
      .json({ message: "You have already voted in this poll." });
  }

  // Increment the votes for the selected option
  poll.options[selectedOptionIndex].votes += 1;

  // Add the user to the voters list with the selected option
  poll.voters.push({ userId, selectedOptionIndex });

  await poll.save();
  res.status(StatusCodes.OK).json(poll);
};

const getPoll = async (pollId, userId) => {
  const poll = await Poll.findById(pollId);
  if (!poll) {
    return res.status(404).json({ message: "Poll not found" });
  }

  // Find the user's vote
  const userVote = poll.voters.find(
    (voter) => voter.userId.toString() === userId._id.toString()
  );

  return {
    ...poll.toObject(),
    contentType: "poll",
    userVote: userVote ? userVote.selectedOptionIndex : null, // Include the selected option index if voted
  };
};

module.exports = { createPoll, vote, getPoll };
