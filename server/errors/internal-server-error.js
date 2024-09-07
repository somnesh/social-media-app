const { StatusCodes } = require("http-status-codes");
const CustomAPIError = require("./custom-api");

class InternalServerError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.InternalServerError;
  }
}

module.exports = InternalServerError;
