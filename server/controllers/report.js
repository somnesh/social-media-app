const { StatusCodes } = require("http-status-codes");
const Report = require("../models/Report");
const { AccessDeniedError, NotFoundError } = require("../errors");

const createReport = async (req, res) => {
  const { id: reported_content_id } = req.params;
  const userId = req.user._id;
  req.body.user_id = userId;
  req.body.reported_content_id = reported_content_id;

  const report = await Report.create(req.body);

  res.status(StatusCodes.CREATED).json({ success: true, report });
};

const getReport = async (req, res) => {
  const { id: reportId } = req.params;
  const report = await Report.findById(reportId);

  res.status(StatusCodes.OK).json(report);
};

const getAllReports = async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sortField = "createdAt",
    sortOrder = "asc",
  } = req.query;

  const sortOptions = {};
  sortOptions[sortField] = sortOrder === "asc" ? -1 : 1;

  const reports = await Report.find({})
    .populate({
      path: "user_id",
      select: "name _id username",
    })
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const totalReports = await Report.countDocuments();

  res.status(StatusCodes.OK).json({
    reports,
    totalPages: Math.ceil(totalReports / limit),
    currentPage: Number(page),
  });
};

const markReportAsUnderReview = async (req, res) => {
  const user = req.user;
  const { id: reportId } = req.params;

  if (user.role !== "admin") {
    throw new AccessDeniedError("You don't have access to perform this action");
  }

  const response = await Report.findOneAndUpdate(
    { _id: reportId },
    { status: "Under Review" },
    { new: true }
  );

  if (!response) {
    throw new NotFoundError("Report not found.");
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "Report marked as Under Review" });
};

const markReportAsResolved = async (req, res) => {
  const user = req.user;
  const { id: reportId } = req.params;

  if (user.role !== "admin") {
    throw new AccessDeniedError("You don't have access to perform this action");
  }

  const response = await Report.findOneAndUpdate(
    { _id: reportId },
    { status: "Resolved" },
    { new: true }
  );

  if (!response) {
    throw new NotFoundError("Report not found.");
  }

  res
    .status(StatusCodes.OK)
    .json({ success: true, msg: "Report marked as Resolved" });
};

const deleteReport = async (req, res) => {
  const user = req.user;
  const { id: reportId } = req.params;

  if (user.role !== "admin") {
    throw new AccessDeniedError("You don't have access to perform this action");
  }

  const response = await Report.findOneAndDelete(
    { _id: reportId },
    { new: true }
  );

  if (!response) {
    throw new NotFoundError("Report not found.");
  }

  res.status(StatusCodes.OK).json({ success: true, msg: "Report dismissed" });
};

module.exports = {
  createReport,
  getReport,
  getAllReports,
  markReportAsUnderReview,
  markReportAsResolved,
  deleteReport,
};
