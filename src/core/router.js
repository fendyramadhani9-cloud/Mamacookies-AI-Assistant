const { getSession } = require("./sessionManager");

async function router(sock, sender, text) {
  const msg = text.toLowerCase().trim();
  const session = getSession(sender);

  // =========================
  // PREORDER SYSTEM
  // =========================
  const { handlePreorder } = require("../features/preorder/preorder.handler");
  const preorderHandled = await handlePreorder(sock, sender, text);
  if (preorderHandled !== false) return;

  // =========================
  // GREETING
  // =========================
  const greetings = [
    "assalamualaikum",
    "halo",
    "hai",
    "permisi"
  ];

  if (greetings.some((g) => msg === g || msg.startsWith(g + " "))) {
    return sock.sendMessage(sender, {
      text:
        "Waalaikumsalam kak 😊\n\n" +
        "Selamat datang di *Mama Cookies* 🍪\n\n" +
        "📌 Ketik *.menu* untuk lihat katalog\n" +
        "🛒 Ketik *.pesan* untuk order\n\n" +
        "Silakan tanya-tanya dulu ya kak 😄"
    });
  }

  // =========================
  // MENU
  // =========================
  if (msg === ".menu" || msg === "menu") {
    const { handleCatalog } = require("../features/catalog/catalog.handler");
    return handleCatalog(sock, sender);
  }

  // =========================
  // BLOCK AI SAAT CHECKOUT
  // =========================
  if (session.mode !== "CHAT") {
    return sock.sendMessage(sender, {
      text: "Kak lanjutkan dulu proses order ya 😊"
    });
  }

  // =========================
  // AI DEFAULT
  // =========================
  const { handleAIChat } = require("../features/aiChat/aiChat.handler");
  return handleAIChat(sock, sender, text);
}

module.exports = { router };