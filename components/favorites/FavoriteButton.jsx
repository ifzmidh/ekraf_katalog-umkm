"use client";

import { HeartIcon } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FavoriteButton({
  productId,
  productName,
  variant = "icon",
  className = "",
}) {
  const { hydrated, isFavorite, toggleFavorite } = useFavorites();
  const active = hydrated && isFavorite(productId);

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(productId, productName);
  }

  if (variant === "button") {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        aria-pressed={active}
        aria-label={
          active
            ? `Hapus ${productName || "produk"} dari favorit`
            : `Simpan ${productName || "produk"} ke favorit`
        }
        className={cn("w-full", className)}
      >
        <HeartIcon
          className={cn(
            "size-4 transition-colors",
            active ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
          )}
          aria-hidden="true"
        />
        <span>{active ? "Tersimpan di Favorit" : "Simpan ke Favorit"}</span>
      </Button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={
        active
          ? `Hapus ${productName || "produk"} dari favorit`
          : `Tambah ${productName || "produk"} ke favorit`
      }
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full border border-border/70 bg-background/90 shadow-sm backdrop-blur transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
    >
      <HeartIcon
        className={cn(
          "size-4 transition-colors",
          active ? "fill-rose-500 text-rose-500" : "text-muted-foreground"
        )}
        aria-hidden="true"
      />
    </button>
  );
}
