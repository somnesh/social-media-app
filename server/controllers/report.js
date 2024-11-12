const { StatusCodes } = require("http-status-codes");
const Report = require("../models/Report");

const report = async (req, res) => {
  const { id: reported_content_id } = req.params;
  const userId = req.user._id;
  req.body.user_id = userId;
  req.body.reported_content_id = reported_content_id;

  const report = await Report.create(req.body);

  res.status(StatusCodes.CREATED).json({ success: true, report });
};

module.exports = { report };
