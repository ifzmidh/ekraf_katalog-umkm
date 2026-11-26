"use client";

import { useEffect, useState } from "react";
import KartuProduk from "@/components/KartuProduk";
import SectionHeading from "@/components/design/SectionHeading";
import { getRecentlyViewedIds } from "@/lib/recently-viewed/recently-viewed-utils";

export default function RecentlyViewed() {
  const [products, setProducts] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const ids = getRecentlyViewedIds();
    if (ids.length === 0) {
      setLoaded(true);
      return;
    }

    let cancelled = false;

    async function loadRecent() {
      try {
        const res = await fetch(`/api/produk-by-ids?ids=${ids.join(",")}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;

        const fetched = Array.isArray(data?.produk) ? data.produk : [];
        const byId = new Map(fetched.map((p) => [Number(p.id), p]));

        // Pastikan urutan sesuai riwayat di localStorage (terbaru di paling depan)
        const ordered = [];
        for (const id of ids) {
          const prod = byId.get(id);
          if (prod) ordered.push(prod);
        }

        setProducts(ordered.slice(0, 10));
      } catch {
        // Abaikan jika gagal mengambil riwayat agar tidak mengganggu katalog utama.
      } finally {
        if (!cancelled) {
          setLoaded(true);
        }
      }
    }

    loadRecent();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || products.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="judul-terakhir-dilihat"
      className="mx-auto max-w-5xl border-t px-4 py-10"
    >
      <SectionHeading
        id="judul-terakhir-dilihat"
        title="Terakhir Dilihat"
        description="Produk yang baru saja Anda lihat."
      />
      <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
        {products.map((produk) => (
          <KartuProduk key={produk.id} produk={produk} />
        ))}
      </div>
    </section>
  );
}
