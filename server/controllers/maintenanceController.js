const MaintenanceConfig = require("../models/MaintenanceConfig");
const cache = require("../config/cache");

// Function to fetch maintenance mode
const checkMaintenanceStatus = async () => {
  let maintenanceMode = cache.get("maintenanceMode");

  if (maintenanceMode === undefined) {
    const config = await MaintenanceConfig.findOne({ key: "maintenance_mode" });
    maintenanceMode = config?.value || false;
    cache.set("maintenanceMode", maintenanceMode); // Cache the value
  }
  return maintenanceMode;
};

// Function to refresh cache when admin changes the setting
const setMaintenanceMode = async (req, res) => {
  const { value } = req.body;

  await MaintenanceConfig.updateOne(
    { key: "maintenance_mode" },
    { value },
    { upsert: true }
  );

  cache.set("maintenanceMode", value); // Update cache
  res.status(200).json({ message: "Maintenance mode updated", value });
};

const getMaintenanceMode = async (req, res) => {
  const isMaintenance = cache.get("maintenanceMode") || false;
  res.status(200).json({ maintenance: isMaintenance });
};
module.exports = {
  getMaintenanceMode,
  checkMaintenanceStatus,
  setMaintenanceMode,
};
