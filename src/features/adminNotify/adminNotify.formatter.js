function formatAdminOrder(order, senderNumber) {
  let itemsText = "";

  if (order.items && order.items.length > 0) {
    order.items.forEach((item) => {
      itemsText += `- ${item.name} x${item.qty}\n`;
    });
  } else {
    itemsText = `- ${order.product} x${order.qty}\n`;
  }

  return (
    `## ORDER PO LEBARAN ##\n` +
    `${order.orderId} - ${order.name.toUpperCase()}\n\n` +
    `📞 WA Customer : ${senderNumber}\n\n` +
    `🛒 Pesanan:\n${itemsText}\n` +
    `📝 Catatan     : ${order.note}\n\n` +
    `📌 Sistem PO   : Ready H-3 Lebaran\n\n` +
    `📍 Lokasi Ambil:\n${process.env.MAPS_LINK}\n\n` +
    `✅ Status      : MENUNGGU KONFIRMASI ADMIN`
  );
}

module.exports = { formatAdminOrder };
