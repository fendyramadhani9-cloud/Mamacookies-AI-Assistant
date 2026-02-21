const { formatAdminOrder } = require("./adminNotify.formatter");

async function notifyAdmin(sock, order, sender) {
  const adminNumber = process.env.ADMIN_NUMBER;

  if (!adminNumber) {
    console.log("⚠️ ADMIN_NUMBER belum di set di .env");
    return;
  }

  const adminJid = adminNumber + "@s.whatsapp.net";
  const senderNumber = sender.replace("@s.whatsapp.net", "");

  const message = formatAdminOrder(order, senderNumber);

  await sock.sendMessage(adminJid, { text: message });
  console.log("✅ Order berhasil dikirim ke admin!");
}

module.exports = { notifyAdmin };
