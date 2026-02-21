const { logError } = require("../utils/logger");

function setupGlobalErrorHandler() {
  process.on("uncaughtException", (err) => {
    logError("Uncaught Exception:", err.message);
  });

  process.on("unhandledRejection", (err) => {
    logError("Unhandled Rejection:", err?.message || err);
  });
}

module.exports = { setupGlobalErrorHandler };
