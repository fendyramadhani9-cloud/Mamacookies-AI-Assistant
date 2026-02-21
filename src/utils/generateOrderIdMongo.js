const Counter = require("../database/models/counter.model");

async function generateOrderIdMongo() {
  const counter = await Counter.findOneAndUpdate(
    { name: "order_counter" },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" }
  );

  return `PO-${String(counter.seq).padStart(3, "0")}`;
}

module.exports = { generateOrderIdMongo };
