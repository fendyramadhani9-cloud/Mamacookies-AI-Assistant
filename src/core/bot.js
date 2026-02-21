const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason
} = require("@whiskeysockets/baileys");

const pino = require("pino");
const qrcode = require("qrcode-terminal");

const { router } = require("./router");
const { logInfo, logSuccess, logWarn, logError } = require("../utils/logger");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: "silent" })
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      logInfo("Scan QR ini buat login WhatsApp:");
      qrcode.generate(qr, { small: true });
    }

    if (connection === "close") {
      const reason = lastDisconnect?.error?.output?.statusCode;
      logError("Connection closed. Reason:", reason);

      // Kalau logout beneran, jangan reconnect
      if (reason === DisconnectReason.loggedOut) {
        logWarn("Bot logout. Hapus folder auth lalu scan ulang.");
        return;
      }

      // Delay reconnect biar WA ga nganggep spam
      logWarn("Reconnecting in 5 seconds...");
      await sleep(7000);

      return startBot();
    }

    if (connection === "open") {
      logSuccess("Bot berhasil tersambung ke WhatsApp!");
    }
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async ({ messages }) => {
    try {
      const msg = messages[0];
      if (!msg) return;
      if (!msg.message) return;
      if (msg.key.fromMe) return;

      const sender = msg.key.remoteJid;

      // skip broadcast/status
      if (sender === "status@broadcast") return;

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption ||
        "";

      if (!text) return;

      logInfo("Pesan masuk:", sender, "=>", text);

      await router(sock, sender, text);
    } catch (err) {
      logError("Error messages.upsert:", err.message);
    }
  });

  return sock;
}

module.exports = { startBot };
