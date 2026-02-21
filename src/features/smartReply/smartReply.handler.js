async function handleSmartReply(sock, sender, text) {
  const msg = text.toLowerCase().trim();

  // =========================
  // KEYWORD GROUPS
  // =========================
  const keywordMenu = ["menu", "katalog", "daftar kue", "ada apa aja", "varian", "jual apa"];
  const keywordOrder = ["cara pesan", "cara order", "gimana order", "gimana pesan", "pesan gimana"];
  const keywordHarga = ["harga", "berapa", "price", "rp", "berapa harganya", "harganya"];
  const keywordLokasi = ["lokasi", "alamat", "maps", "google map", "dimana", "di mana", "rumahnya dimana"];
  const keywordReady = ["ready kapan", "ambil kapan", "kapan jadi", "kapan bisa diambil", "kapan ambil"];
  const keywordBestSeller = ["best seller", "rekomendasi", "yang enak", "yang paling enak", "favorit", "recomend", "rekom"];
  const keywordPengiriman = ["bisa kirim", "delivery", "diantar", "antar", "ojol", "gojek", "grab"];
  const keywordPO = ["po", "pre order", "preorder", "sistem po", "open po", "buka po"];

  // =========================
  // CARA ORDER
  // =========================
  if (keywordOrder.some((k) => msg.includes(k))) {
    return sock.sendMessage(sender, {
      text:
        "🛒 *Cara Order Mama Cookies*\n\n" +
        "1) Ketik *.menu* untuk lihat katalog\n" +
        "2) Ketik *.pesan* untuk mulai order\n" +
        "3) Isi nama + pesanan + jumlah\n" +
        "4) Konfirmasi pesanan\n\n" +
        "Kalau sudah selesai nanti order otomatis masuk ke admin 😊🍪"
    });
  }

  // =========================
  // HARGA
  // =========================
  if (keywordHarga.some((k) => msg.includes(k))) {
    return sock.sendMessage(sender, {
      text:
        "Untuk harga saat ini masih belum ditentukan ya kak 😊\n" +
        "Nanti admin akan konfirmasi harga setelah kak order.\n\n" +
        "Kalau mau order langsung ketik *.pesan* 🍪"
    });
  }

  // =========================
  // LOKASI / MAPS
  // =========================
  if (keywordLokasi.some((k) => msg.includes(k))) {
    return sock.sendMessage(sender, {
      text:
        "📍 Lokasi ambil di *rumah produksi Mama Cookies* ya kak 😊\n\n" +
        "Link Google Maps:\n" +
        `${process.env.MAPS_LINK}\n\n` +
        "Kalau mau order langsung ketik *.pesan* 🍪"
    });
  }

  // =========================
  // READY / AMBIL KAPAN
  // =========================
  if (keywordReady.some((k) => msg.includes(k))) {
    return sock.sendMessage(sender, {
      text:
        "Untuk sistem PO Lebaran, pesanan akan *ready H-3 Lebaran* ya kak 😊\n" +
        "Nanti bisa ambil langsung di rumah produksi.\n\n" +
        "Kalau mau order langsung ketik *.pesan* 🍪"
    });
  }

  // =========================
  // SISTEM PO
  // =========================
  if (keywordPO.some((k) => msg.includes(k))) {
    return sock.sendMessage(sender, {
      text:
        "📌 *Sistem PO Mama Cookies*\n\n" +
        "✅ PO dibuka dari sekarang\n" +
        "✅ Ready H-3 Lebaran\n" +
        "✅ Ambil langsung di rumah produksi\n\n" +
        "Untuk lihat menu ketik *.menu*\n" +
        "Untuk order ketik *.pesan* 😊🍪"
    });
  }

  // =========================
  // BEST SELLER / REKOMENDASI
  // =========================
  if (keywordBestSeller.some((k) => msg.includes(k))) {
    return sock.sendMessage(sender, {
      text:
        "✨ *Rekomendasi Best Seller Mama Cookies*\n\n" +
        "🍪 Nastar Klasik\n" +
        "🍪 Putri Salju\n" +
        "🍪 Kastengel\n\n" +
        "Kalau mau lihat semua menu ketik *.menu*\n" +
        "Kalau mau order langsung ketik *.pesan* 😊"
    });
  }

  // =========================
  // PENGIRIMAN / DELIVERY
  // =========================
  if (keywordPengiriman.some((k) => msg.includes(k))) {
    return sock.sendMessage(sender, {
      text:
        "Untuk saat ini sistemnya *ambil langsung di rumah produksi* ya kak 😊\n\n" +
        "Kalau kak mau pakai ojol (Gojek/Grab) bisa dibicarakan nanti dengan admin ya.\n\n" +
        "Kalau mau order langsung ketik *.pesan* 🍪"
    });
  }

  // =========================
  // MENU REQUEST DETECT (BIAR NGGA NYASAR)
  // =========================
  if (keywordMenu.some((k) => msg.includes(k))) {
    return false; // biar router lempar ke catalog handler
  }

  return false;
}

module.exports = { handleSmartReply };
