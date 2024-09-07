const NotFoundError = require("./not-found");
const BadRequestError = require("./bad-request");
const UnauthenticatedError = require("./unauthenticated");
const AccessDeniedError = require("./access-denied");
const InternalServerError = require("./internal-server-error");

module.exports = {
  NotFoundError,
  BadRequestError,
  UnauthenticatedError,
  AccessDeniedError,
  InternalServerError,
};
