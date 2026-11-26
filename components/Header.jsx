"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useToko } from "@/components/TokoProvider";
import CartButton from "@/components/cart/CartButton";
import FavoritesHeaderLink from "@/components/favorites/FavoritesHeaderLink";
import { cn } from "@/lib/utils";

function buatUrlKategori(kategori, kataKunci) {
  const params = new URLSearchParams();
  if (kategori) params.set("kategori", kategori);
  if (kataKunci) params.set("q", kataKunci);
  const query = params.toString();
  return query ? `/?${query}#produk` : "/#produk";
}

export default function Header({ categories = [], selectedCategory, query = "" }) {
  const toko = useToko();
  const pathname = usePathname();
  const isTentang = pathname === "/tentang";

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex max-w-5xl items-center gap-5 px-4 py-3">
        <Link href="/" className="shrink-0 font-heading text-xl font-semibold tracking-tight text-primary">
          {toko.nama}
        </Link>
        <nav aria-label="Navigasi katalog" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto whitespace-nowrap text-sm">
          <Link href="/#produk" className="rounded-md px-3 py-2 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            Katalog
          </Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={buatUrlKategori(category, query)}
              aria-current={selectedCategory === category ? "page" : undefined}
              className={cn(
                "rounded-md px-3 py-2 font-medium transition-colors",
                selectedCategory === category
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {category}
            </Link>
          ))}
          <Link
            href="/tentang"
            aria-current={isTentang ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 font-medium transition-colors",
              isTentang
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            Tentang
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-1.5">
          <FavoritesHeaderLink />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
