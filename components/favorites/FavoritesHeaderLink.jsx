"use client";

import Link from "next/link";
import { HeartIcon } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function FavoritesHeaderLink() {
  const { totalFavorites, hydrated } = useFavorites();

  return (
    <Link
      href="/favorit"
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        "relative shrink-0 gap-1.5"
      )}
      aria-label={
        hydrated && totalFavorites > 0
          ? `Produk favorit (${totalFavorites})`
          : "Produk favorit"
      }
    >
      <HeartIcon className="size-4" aria-hidden="true" />
      <span className="hidden md:inline">Favorit</span>
      {hydrated && totalFavorites > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white tabular-nums">
          {totalFavorites > 99 ? "99+" : totalFavorites}
        </span>
      )}
    </Link>
  );
}
