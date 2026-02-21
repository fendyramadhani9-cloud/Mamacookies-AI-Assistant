const Order = require("../../database/models/order.model");
const { isAdmin } = require("../../core/isAdmin");

async function handleAdmin(sock, sender, text) {
  const msg = text.trim();
  const lower = msg.toLowerCase();

  if (!lower.startsWith(".")) return false;
  if (!isAdmin(sender)) return false;

  // =========================
  // LIST ORDER PENDING
  // =========================
  if (lower === ".list") {
    const orders = await Order.find({ status: "PENDING" }).sort({ createdAt: 1 });

    if (orders.length === 0) {
      return sock.sendMessage(sender, {
        text: "✅ Tidak ada order PENDING saat ini."
      });
    }

    let result = "📌 *LIST ORDER PENDING*\n\n";

    orders.forEach((o, i) => {
      result += `${i + 1}. ${o.orderId} - ${o.name}\n`;
    });

    result += `\nTotal: ${orders.length} order`;

    return sock.sendMessage(sender, { text: result });
  }

  return false;
}

module.exports = { handleAdmin };
