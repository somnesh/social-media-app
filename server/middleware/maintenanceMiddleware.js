const {
  checkMaintenanceStatus,
} = require("../controllers/maintenanceController");

const maintenanceMiddleware = async (req, res, next) => {
  const isMaintenance = await checkMaintenanceStatus();

  if (isMaintenance) {
    return res.status(503).json({
      message:
        "The application is currently under maintenance. Please try again later.",
    });
  }

  next(); // Proceed to next middleware or route
};

module.exports = maintenanceMiddleware;
