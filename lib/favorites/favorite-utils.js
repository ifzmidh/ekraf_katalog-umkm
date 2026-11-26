export const FAVORITES_STORAGE_KEY = "umkm-favorites";

/**
 * Memvalidasi dan menormalkan daftar ID favorit (bilangan bulat positif, tanpa duplikat).
 */
export function sanitizeFavoriteIds(raw) {
  if (!Array.isArray(raw)) return [];

  const seen = new Set();
  const result = [];

  for (const val of raw) {
    const id = Number(val);
    if (Number.isSafeInteger(id) && id > 0 && !seen.has(id)) {
      seen.add(id);
      result.push(id);
    }
  }

  return result;
}

export function loadFavoritesFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    return sanitizeFavoriteIds(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function saveFavoritesToStorage(ids) {
  if (typeof window === "undefined") return;
  try {
    const clean = sanitizeFavoriteIds(ids);
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(clean));
  } catch {
    // Abaikan jika storage penuh atau diblokir browser.
  }
}
