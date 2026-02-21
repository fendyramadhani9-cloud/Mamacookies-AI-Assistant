function parseItems(input) {
  // Support:
  // 1) "nastar klasik x2, putri salju x1"
  // 2) "nastar klasik 2\nputri salju 1"

  let parts = [];

  if (input.includes(",")) {
    parts = input.split(",").map((p) => p.trim()).filter(Boolean);
  } else {
    parts = input.split("\n").map((p) => p.trim()).filter(Boolean);
  }

  const items = [];

  for (const part of parts) {
    // cari qty di akhir kalimat: "x2" atau "2"
    const match = part.match(/(x\s*)?(\d+)$/i);

    if (!match) return null;

    const qty = parseInt(match[2]);
    const name = part.replace(match[0], "").trim();

    if (!name || isNaN(qty) || qty <= 0) return null;

    items.push({ name, qty });
  }

  return items.length > 0 ? items : null;
}

module.exports = { parseItems };
