const NodeCache = require("node-cache");

// Initialize cache with default TTL (e.g., 5 minutes)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

module.exports = cache;
