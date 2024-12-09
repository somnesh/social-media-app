const mongoose = require("mongoose");

const MaintenanceConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("MaintenanceConfig", MaintenanceConfigSchema);
