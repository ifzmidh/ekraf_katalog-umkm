import { formatRupiah } from "../format.js";

export const CART_STORAGE_KEY = "umkm-cart";

/**
 * Mengembalikan harga aktif produk: harga_diskon jika valid dan lebih kecil dari harga normal.
 */
export function getHargaAktif(item) {
  if (!item) return 0;
  const harga = Number(item.harga);
  const hargaDiskon =
    item.harga_diskon === null || item.harga_diskon === undefined
      ? null
      : Number(item.harga_diskon);

  if (
    typeof hargaDiskon === "number" &&
    Number.isFinite(hargaDiskon) &&
    hargaDiskon > 0 &&
    Number.isFinite(harga) &&
    hargaDiskon < harga
  ) {
    return hargaDiskon;
  }

  return Number.isFinite(harga) && harga >= 0 ? harga : 0;
}

export function isDiskonAktif(item) {
  if (!item) return false;
  const harga = Number(item.harga);
  const hargaDiskon =
    item.harga_diskon === null || item.harga_diskon === undefined
      ? null
      : Number(item.harga_diskon);

  return (
    typeof hargaDiskon === "number" &&
    Number.isFinite(hargaDiskon) &&
    hargaDiskon > 0 &&
    Number.isFinite(harga) &&
    hargaDiskon < harga
  );
}

/**
 * Memvalidasi dan menormalkan array item keranjang dari localStorage.
 * Menggabungkan duplikasi ID jika ada dan membuang item tidak valid.
 */
export function sanitizeCartItems(raw) {
  if (!Array.isArray(raw)) return [];

  const byId = new Map();

  for (const entry of raw) {
    if (!entry || typeof entry !== "object") continue;

    const productId = Number(entry.productId);
    if (!Number.isSafeInteger(productId) || productId <= 0) continue;

    const nama = typeof entry.nama === "string" ? entry.nama.trim() : "";
    if (!nama) continue;

    const harga = Number(entry.harga);
    if (!Number.isFinite(harga) || harga < 0) continue;

    const rawDiskon =
      entry.harga_diskon === null || entry.harga_diskon === undefined
        ? null
        : Number(entry.harga_diskon);
    const harga_diskon =
      rawDiskon !== null && Number.isFinite(rawDiskon) && rawDiskon > 0
        ? rawDiskon
        : null;

    const rawStok =
      entry.stok === null || entry.stok === undefined
        ? null
        : Number(entry.stok);
    const stok =
      rawStok !== null && Number.isInteger(rawStok) && rawStok >= 0
        ? rawStok
        : null;

    const rawQty = Number(entry.quantity);
    let quantity = Number.isInteger(rawQty) && rawQty >= 1 ? rawQty : 1;
    if (stok !== null && stok > 0 && quantity > stok) {
      quantity = stok;
    }

    const foto_url =
      typeof entry.foto_url === "string" && entry.foto_url.trim()
        ? entry.foto_url.trim()
        : null;

    const existing = byId.get(productId);
    if (existing) {
      let mergedQty = existing.quantity + quantity;
      if (stok !== null && stok > 0) {
        mergedQty = Math.min(mergedQty, stok);
      }
      byId.set(productId, { ...existing, quantity: mergedQty });
    } else {
      byId.set(productId, {
        productId,
        nama,
        harga,
        harga_diskon,
        stok,
        foto_url,
        quantity,
        unavailable: Boolean(entry.unavailable),
      });
    }
  }

  return Array.from(byId.values());
}

export function loadCartFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return sanitizeCartItems(parsed);
  } catch {
    return [];
  }
}

export function saveCartToStorage(items) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Abaikan jika storage penuh atau diblokir browser.
  }
}

export function calculateCartTotals(items) {
  let totalItems = 0;
  let totalPrice = 0;

  for (const item of items) {
    const qty = Number.isInteger(item.quantity) && item.quantity >= 1 ? item.quantity : 0;
    totalItems += qty;
    totalPrice += getHargaAktif(item) * qty;
  }

  return { totalItems, totalPrice };
}

/**
 * Menyusun pesan pesanan WhatsApp terstruktur untuk seluruh isi keranjang.
 */
export function buildWhatsAppCheckoutMessage(items) {
  const lines = ["Halo, saya ingin memesan:", ""];

  items.forEach((item, index) => {
    const hargaAktif = getHargaAktif(item);
    const subtotal = hargaAktif * item.quantity;
    lines.push(`${index + 1}. ${item.nama}`);
    lines.push(
      `   ${item.quantity} x ${formatRupiah(hargaAktif)} = ${formatRupiah(subtotal)}`
    );
    lines.push("");
  });

  const { totalPrice } = calculateCartTotals(items);
  lines.push("------------------------");
  lines.push(`Total: ${formatRupiah(totalPrice)}`);
  lines.push("");
  lines.push("Mohon informasi lebih lanjut mengenai pesanan saya.");
  lines.push("Terima kasih.");

  return lines.join("\n");
}

export function buildWhatsAppCheckoutUrl(items, nomorWhatsApp) {
  const nomor = String(nomorWhatsApp || "").replace(/\D/g, "");
  const pesan = buildWhatsAppCheckoutMessage(items);
  return `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;
}
