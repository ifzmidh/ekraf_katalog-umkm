export const RECENTLY_VIEWED_STORAGE_KEY = "umkm-recently-viewed";
export const MAX_RECENTLY_VIEWED = 10;

/**
 * Memvalidasi daftar ID terakhir dilihat: unik, bilangan bulat positif, maksimal 10.
 */
export function sanitizeRecentlyViewedIds(raw) {
  if (!Array.isArray(raw)) return [];

  const seen = new Set();
  const result = [];

  for (const val of raw) {
    const id = Number(val);
    if (Number.isSafeInteger(id) && id > 0 && !seen.has(id)) {
      seen.add(id);
      result.push(id);
      if (result.length >= MAX_RECENTLY_VIEWED) break;
    }
  }

  return result;
}

export function getRecentlyViewedIds() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
    if (!raw) return [];
    return sanitizeRecentlyViewedIds(JSON.parse(raw));
  } catch {
    return [];
  }
}

/**
 * Menambahkan ID produk ke urutan paling atas riwayat terakhir dilihat.
 * Produk yang sama dipindahkan ke posisi teratas dan dibatasi maksimal 10 item.
 */
export function addRecentlyViewedId(productId) {
  if (typeof window === "undefined") return [];
  const id = Number(productId);
  if (!Number.isSafeInteger(id) || id <= 0) return getRecentlyViewedIds();

  const current = getRecentlyViewedIds();
  const next = [id, ...current.filter((item) => item !== id)].slice(
    0,
    MAX_RECENTLY_VIEWED
  );

  try {
    window.localStorage.setItem(
      RECENTLY_VIEWED_STORAGE_KEY,
      JSON.stringify(next)
    );
  } catch {
    // Abaikan jika storage penuh atau diblokir browser.
  }

  return next;
}
