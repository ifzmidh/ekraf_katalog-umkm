"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "lucide-react";
import KartuProduk from "@/components/KartuProduk";
import EmptyState from "@/components/design/EmptyState";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { Skeleton } from "@/components/ui/skeleton";

export default function FavoritesView() {
  const { favoriteIds, hydrated, replaceFavorites } = useFavorites();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!hydrated) return;

    if (favoriteIds.length === 0) {
      setProducts([]);
      setLoading(false);
      setErrorMsg("");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorMsg("");

    async function fetchFavorites() {
      try {
        const res = await fetch(
          `/api/produk-by-ids?ids=${favoriteIds.join(",")}`,
          { cache: "no-store" }
        );
        if (!res.ok) {
          throw new Error("Gagal memuat produk favorit.");
        }
        const data = await res.json();
        if (cancelled) return;

        const fetched = Array.isArray(data?.produk) ? data.produk : [];
        const byId = new Map(fetched.map((p) => [Number(p.id), p]));

        // Pertahankan urutan favorit dan bersihkan ID yang sudah dihapus dari DB
        const ordered = [];
        const validIds = [];
        for (const id of favoriteIds) {
          const prod = byId.get(id);
          if (prod) {
            ordered.push(prod);
            validIds.push(id);
          }
        }

        setProducts(ordered);
        if (validIds.length !== favoriteIds.length) {
          replaceFavorites(validIds);
        }
      } catch {
        if (!cancelled) {
          setErrorMsg(
            "Gagal mengambil data produk favorit. Silakan muat ulang halaman."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchFavorites();
    return () => {
      cancelled = true;
    };
  }, [favoriteIds, hydrated, replaceFavorites]);

  if (!hydrated || loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-col gap-3 rounded-xl border p-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div
        role="alert"
        className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
      >
        {errorMsg}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={HeartIcon}
        title="Belum ada produk favorit"
        description="Tandai produk yang Anda sukai dengan ikon hati agar mudah ditemukan kembali di sini."
        actionLabel="Jelajahi katalog"
        actionHref="/#produk"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
      {products.map((produk) => (
        <KartuProduk key={produk.id} produk={produk} />
      ))}
    </div>
  );
}
