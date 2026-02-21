function logInfo(...args) {
  console.log("ℹ️", ...args);
}

function logSuccess(...args) {
  console.log("✅", ...args);
}

function logWarn(...args) {
  console.log("⚠️", ...args);
}

function logError(...args) {
  console.log("❌", ...args);
}

module.exports = { logInfo, logSuccess, logWarn, logError };
