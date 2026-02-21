const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customerNumber: { type: String, required: true },

  name: { type: String, required: true },

  items: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true }
    }
  ],

  note: { type: String, default: "-" },

  status: {
    type: String,
    default: "PENDING"
    // PENDING / CONFIRMED / DONE / CANCELED
  },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
