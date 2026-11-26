"use client";

import Link from "next/link";
import { useToko } from "@/components/TokoProvider";

export default function Footer() {
  const toko = useToko();

  return (
    <footer id="tentang" className="mt-16 border-t bg-secondary/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">{toko.nama}</p>
          <p className="mt-2 max-w-md whitespace-pre-line leading-6">
            {toko.alamat || "Alamat toko belum tersedia."}
          </p>
          <p className="mt-1 whitespace-pre-line">
            {toko.jamBuka || "Jam operasional belum tersedia."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 self-start sm:self-end">
          <Link
            href="/tentang"
            className="font-medium text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Tentang & Kontak Toko
          </Link>
          <Link
            href="/admin"
            className="font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
          >
            Masuk sebagai admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
