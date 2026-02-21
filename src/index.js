require("dotenv").config();

const { setupGlobalErrorHandler } = require("./core/errorHandler");
const { startBot } = require("./core/bot");
const { connectMongo } = require("./database/mongo");

setupGlobalErrorHandler();

console.log("🚀 Starting MamaCookies AI PO Bot...");

(async () => {
  await connectMongo();
  startBot();
})();
