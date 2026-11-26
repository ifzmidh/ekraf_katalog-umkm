"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import {
  loadFavoritesFromStorage,
  sanitizeFavoriteIds,
  saveFavoritesToStorage,
} from "@/lib/favorites/favorite-utils";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setFavoriteIds(loadFavoritesFromStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveFavoritesToStorage(favoriteIds);
  }, [favoriteIds, hydrated]);

  const isFavorite = useCallback(
    (productId) => favoriteIds.includes(Number(productId)),
    [favoriteIds]
  );

  const toggleFavorite = useCallback((productId, productName) => {
    const id = Number(productId);
    if (!Number.isSafeInteger(id) || id <= 0) return;

    setFavoriteIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        toast(
          productName
            ? `${productName} dihapus dari favorit`
            : "Dihapus dari favorit"
        );
        return prev.filter((item) => item !== id);
      }
      toast.success(
        productName
          ? `${productName} ditambahkan ke favorit`
          : "Ditambahkan ke favorit"
      );
      return [id, ...prev];
    });
  }, []);

  const replaceFavorites = useCallback((ids) => {
    setFavoriteIds(sanitizeFavoriteIds(ids));
  }, []);

  const value = useMemo(
    () => ({
      favoriteIds,
      hydrated,
      totalFavorites: favoriteIds.length,
      isFavorite,
      toggleFavorite,
      replaceFavorites,
    }),
    [favoriteIds, hydrated, isFavorite, toggleFavorite, replaceFavorites]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites harus digunakan di dalam FavoritesProvider");
  }
  return ctx;
}
