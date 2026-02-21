const products = require("../../config/products.json");

async function handleCatalog(sock, sender) {
  let text = `🍪 *KATALOG PO LEBARAN - MAMA COOKIES*\n\n`;

  products.forEach((p) => {
    text += `*${p.id}. ${p.name}*\n`;
    p.variants.forEach((v) => {
      text += `   - ${v}\n`;
    });
    text += `\n`;
  });

  text += `📌 *Sistem PO Lebaran*\n`;
  text += `✅ PO dibuka dari sekarang\n`;
  text += `✅ Ready H-3 Lebaran\n`;

  text += `Ketik *pesan* untuk mulai order 😊`;

  return sock.sendMessage(sender, { text });
}

module.exports = { handleCatalog };
