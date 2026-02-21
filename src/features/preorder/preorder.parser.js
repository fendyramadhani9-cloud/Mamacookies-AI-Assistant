function parseOrderTemplate(text) {
  const lines = text.split("\n").map((l) => l.trim());

  const order = {};

  for (const line of lines) {
    if (line.toLowerCase().startsWith("nama:")) {
      order.name = line.split(":").slice(1).join(":").trim();
    }

    if (line.toLowerCase().startsWith("pesanan:")) {
      order.product = line.split(":").slice(1).join(":").trim();
    }

    if (line.toLowerCase().startsWith("jumlah:")) {
      const qtyText = line.split(":").slice(1).join(":").trim();
      order.qty = parseInt(qtyText);
    }

    if (line.toLowerCase().startsWith("catatan:")) {
      order.note = line.split(":").slice(1).join(":").trim();
    }
  }

  if (!order.note) order.note = "-";

  if (!order.name || !order.product || !order.qty) {
    return null;
  }

  if (isNaN(order.qty) || order.qty <= 0) {
    return null;
  }

  return order;
}

module.exports = { parseOrderTemplate };
