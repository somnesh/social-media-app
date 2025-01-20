const Feedback = require("../models/Feedback");
const { StatusCodes } = require("http-status-codes");

const submitFeedback = async (req, res) => {
  const { feedback } = req.body;

  await Feedback.create({ user_id: req.user, feedback: feedback });

  res
    .status(StatusCodes.CREATED)
    .json({ success: true, msg: "Feedback submitted" });
};

const fetchAllFeedbacks = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortOrder = "asc",
  } = req.query;

  const sortOptions = {};
  sortOptions[sortField] = sortOrder === "asc" ? -1 : 1;

  const feedbacks = await Feedback.find({})
    .populate({
      path: "user_id",
      select: "name _id username",
    })
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalFeedbacks = await Feedback.countDocuments();

  res.status(StatusCodes.OK).json({
    feedbacks,
    totalPages: Math.ceil(totalFeedbacks / limit),
    currentPage: Number(page),
  });
};

const deleteFeedback = async (req, res) => {
  const { id: feedbackId } = req.params;
  const response = await Feedback.findOneAndDelete({ _id: feedbackId });

  if (!response) {
    throw new NotFoundError(`Feedback not found`);
  }

  res.status(StatusCodes.OK).json({ success: true, msg: "Feedback Deleted" });
};

module.exports = { submitFeedback, fetchAllFeedbacks, deleteFeedback };
