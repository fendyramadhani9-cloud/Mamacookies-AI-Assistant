const { getSession, resetSession } = require("../../core/sessionManager");
const { notifyAdmin } = require("../adminNotify/adminNotify.service");
const { parseItems } = require("./preorder.itemsParser");

const { generateOrderIdMongo } = require("../../utils/generateOrderIdMongo");
const Order = require("../../database/models/order.model");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeSendMessage(sock, jid, payload, retry = 3) {
  for (let i = 0; i < retry; i++) {
    try {
      await sock.sendMessage(jid, payload);
      return true;
    } catch (err) {
      console.log(`❌ SendMessage failed (attempt ${i + 1}):`, err.message);
      await sleep(3000);
    }
  }
  return false;
}

async function handlePreorder(sock, sender, text) {
  const session = getSession(sender);

  const msg = text.trim();
  const lower = msg.toLowerCase();

  // =========================
  // ADMIN COMMAND BYPASS
  // =========================
  if (
    lower.startsWith(".list") ||
    lower.startsWith(".done") ||
    lower.startsWith(".cancel") ||
    lower.startsWith(".detail")
  ) {
    return false;
  }

  // =========================
  // COMMAND BATAL (KAPAN AJA)
  // =========================
  if (lower === ".batal" || lower === "batal") {
    resetSession(sender);
    return safeSendMessage(sock, sender, {
      text: "❌ Pesanan dibatalkan kak. Kalau mau order lagi ketik *.pesan* 😊"
    });
  }

  // =========================
  // TRIGGER MULAI ORDER (FLEKSIBEL)
  // =========================
  const isStartOrder =
    lower === ".pesan" ||
    lower === "#pesan" ||
    lower.startsWith("pesan") ||
    lower.startsWith("pesen") ||
    lower.startsWith("order") ||
    lower.startsWith("beli") ||
    lower.includes("mau beli") ||
    lower.includes("mau pesan") ||
    lower.includes("mau order") ||
    lower.includes("pengen beli") ||
    lower.includes("pengen pesan");

  if (isStartOrder && session.mode === "CHAT") {
    session.mode = "START_CONFIRM";

    return safeSendMessage(sock, sender, {
      text:
        "Siap kak 😊 mau mulai order PO Lebaran?\n\n" +
        "Ketik *YA* untuk lanjut\n" +
        "Ketik *TIDAK* untuk batal"
    });
  }

  // =========================
  // KONFIRMASI MULAI ORDER
  // =========================
  if (session.mode === "START_CONFIRM") {
    if (lower === "tidak") {
      resetSession(sender);
      return safeSendMessage(sock, sender, {
        text: "Oke kak 😊 kalau mau order tinggal ketik *.pesan* ya 🍪"
      });
    }

    if (lower !== "ya") {
      return safeSendMessage(sock, sender, {
        text: "Ketik *YA* untuk lanjut atau *TIDAK* untuk batal ya kak 😊"
      });
    }

    session.mode = "CHECKOUT";
    session.step = "ASK_NAME";
    session.order = {};

    return safeSendMessage(sock, sender, {
      text: "Oke kak 😄 atas nama siapa?"
    });
  }

  // kalau belum mode order, skip
  if (session.mode === "CHAT") return false;

  // =========================
  // MODE CHECKOUT
  // =========================
  if (session.mode === "CHECKOUT") {
    // STEP 1: ASK NAME
    if (session.step === "ASK_NAME") {
      session.order.name = msg;
      session.step = "ASK_ITEMS";

      return safeSendMessage(sock, sender, {
        text:
          `Sip kak *${msg}* 😊\n\n` +
          `Mau pesan apa aja kak?\n\n` +
          `Format contoh:\n` +
          `Nastar Bunga x2\n` +
          `Putri Salju x1\n\n` +
          `Atau pakai koma:\n` +
          `Nastar Bunga x2, Putri Salju x1\n\n` +
          `⚠️ Wajib ada jumlah ya kak 😊`
      });
    }

    // STEP 2: ASK ITEMS
    if (session.step === "ASK_ITEMS") {
      const items = parseItems(msg);

      if (!items) {
        return safeSendMessage(sock, sender, {
          text:
            "Format pesanan belum bener kak 😭\n\n" +
            "Contoh yang benar:\n" +
            "*Nastar Klasik x2*\n" +
            "*Putri Salju x1*\n\n" +
            "Atau:\n" +
            "*Nastar Klasik x2, Putri Salju x1*"
        });
      }

      session.order.items = items;
      session.step = "ASK_NOTE";

      let preview = "";
      items.forEach((it) => {
        preview += `- ${it.name} x${it.qty}\n`;
      });

      return safeSendMessage(sock, sender, {
        text:
          `Oke kak 😊 pesanan sementara:\n\n${preview}\n` +
          `Ada catatan khusus kak?\n` +
          `(kalau tidak ada ketik: tidak)`
      });
    }

    // STEP 3: ASK NOTE
    if (session.step === "ASK_NOTE") {
      session.order.note = lower === "tidak" ? "-" : msg;
      session.order.pickupInfo = "Ready H-3 Lebaran (Ambil di rumah produksi)";

      session.mode = "CONFIRM_ORDER";

      let itemsText = "";
      session.order.items.forEach((it) => {
        itemsText += `- ${it.name} x${it.qty}\n`;
      });

      return safeSendMessage(sock, sender, {
        text:
          `📌 *Konfirmasi Pesanan*\n\n` +
          `👤 Nama: ${session.order.name}\n\n` +
          `🛒 Pesanan:\n${itemsText}\n` +
          `📝 Catatan: ${session.order.note}\n\n` +
          `📌 Sistem PO: Ready H-3 Lebaran\n` +
          `📍 Ambil di rumah produksi\n\n` +
          `Ketik *YA* untuk konfirmasi\n` +
          `Ketik *TIDAK* untuk batal`
      });
    }
  }

  // =========================
  // MODE CONFIRM ORDER
  // =========================
  if (session.mode === "CONFIRM_ORDER") {
    if (lower === "tidak") {
      resetSession(sender);

      return safeSendMessage(sock, sender, {
        text: "❌ Pesanan dibatalkan kak. Kalau mau pesan lagi ketik *.pesan* 😊"
      });
    }

    if (lower !== "ya") {
      return safeSendMessage(sock, sender, {
        text: "Ketik *YA* untuk konfirmasi atau *TIDAK* untuk batal ya kak 😊"
      });
    }

    // =========================
    // FINALIZE ORDER (SAVE DB FIRST)
    // =========================
    let savedOrderId = null;

    try {
      session.order.orderId = await generateOrderIdMongo();
      savedOrderId = session.order.orderId;

      await Order.create({
        orderId: savedOrderId,
        customerNumber: sender,
        name: session.order.name,
        items: session.order.items,
        note: session.order.note,
        status: "PENDING"
      });

      console.log("✅ Order saved to MongoDB:", savedOrderId);
    } catch (err) {
      console.log("❌ MongoDB Save Error:", err.message);

      resetSession(sender);

      return safeSendMessage(sock, sender, {
        text:
          "❌ Maaf kak, sistem sedang error saat menyimpan order.\n" +
          "Silakan coba lagi beberapa menit ya 😭"
      });
    }

    // =========================
    // RESET SESSION CEPAT (ANTI LOOP)
    // =========================
    const orderCopy = JSON.parse(JSON.stringify(session.order));
    orderCopy.orderId = savedOrderId;

    resetSession(sender);

    // =========================
    // NOTIFY ADMIN (SAFE)
    // =========================
    await sleep(7000);

    try {
      await notifyAdmin(sock, orderCopy, sender);
      console.log("✅ Admin notified:", process.env.ADMIN_NUMBER);
    } catch (err) {
      console.log("❌ Notify Admin Error:", err.message);
    }

    // =========================
    // CONFIRM CUSTOMER (SAFE)
    // =========================
    await sleep(7000);

    let itemsText = "";
    orderCopy.items.forEach((it) => {
      itemsText += `- ${it.name} x${it.qty}\n`;
    });

    await safeSendMessage(sock, sender, {
      text:
        `✅ Pesanan berhasil dicatat kak!\n\n` +
        `🆔 Order ID: *${orderCopy.orderId}*\n` +
        `👤 Nama: ${orderCopy.name}\n\n` +
        `🛒 Pesanan:\n${itemsText}\n` +
        `📝 Catatan: ${orderCopy.note}\n\n` +
        `📌 Sistem PO: Ready H-3 Lebaran\n` +
        `📍 Ambil di rumah produksi\n\n` +
        `📍 Lokasi Google Maps:\n${process.env.MAPS_LINK}\n\n` +
        `Terima kasih kak 😊🍪`
    });

    return true;
  }

  return false;
}

module.exports = { handlePreorder };
