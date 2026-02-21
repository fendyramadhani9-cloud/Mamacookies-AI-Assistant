const mongoose = require("mongoose");

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected!");
  } catch (err) {
    console.log("❌ MongoDB Connection Error:", err.message);
  }
}

module.exports = { connectMongo };
