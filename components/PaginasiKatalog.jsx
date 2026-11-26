"use client";

import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/**
 * Komponen pagination berbasis URL.
 * Mempertahankan semua search params lain (sort, q, kategori) saat berpindah halaman.
 */
export default function PaginasiKatalog({ halamanSaatIni, totalHalaman }) {
  const searchParams = useSearchParams();

  function buatHrefHalaman(nomor) {
    const params = new URLSearchParams(searchParams.toString());
    if (nomor <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(nomor));
    }
    const query = params.toString();
    return query ? `/?${query}#produk` : "/#produk";
  }

  if (totalHalaman <= 1) return null;

  // Buat daftar halaman yang ditampilkan (dengan ellipsis)
  function daftarHalaman() {
    const halaman = [];
    const delta = 1; // jumlah halaman di kiri-kanan halaman aktif

    const awal = Math.max(2, halamanSaatIni - delta);
    const akhir = Math.min(totalHalaman - 1, halamanSaatIni + delta);

    halaman.push(1);

    if (awal > 2) halaman.push("ellipsis-awal");

    for (let i = awal; i <= akhir; i++) {
      halaman.push(i);
    }

    if (akhir < totalHalaman - 1) halaman.push("ellipsis-akhir");

    if (totalHalaman > 1) halaman.push(totalHalaman);

    return halaman;
  }

  const daftar = daftarHalaman();
  const adaSebelumnya = halamanSaatIni > 1;
  const adaBerikutnya = halamanSaatIni < totalHalaman;

  return (
    <Pagination>
      <PaginationContent>
        {/* Tombol Sebelumnya */}
        <PaginationItem>
          {adaSebelumnya ? (
            <PaginationPrevious
              href={buatHrefHalaman(halamanSaatIni - 1)}
              text="Sebelumnya"
            />
          ) : (
            <PaginationPrevious
              href="#"
              text="Sebelumnya"
              aria-disabled="true"
              className="pointer-events-none opacity-50"
              tabIndex={-1}
            />
          )}
        </PaginationItem>

        {/* Nomor halaman */}
        {daftar.map((item) => {
          if (item === "ellipsis-awal" || item === "ellipsis-akhir") {
            return (
              <PaginationItem key={item}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          return (
            <PaginationItem key={item}>
              <PaginationLink
                href={buatHrefHalaman(item)}
                isActive={item === halamanSaatIni}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Tombol Berikutnya */}
        <PaginationItem>
          {adaBerikutnya ? (
            <PaginationNext
              href={buatHrefHalaman(halamanSaatIni + 1)}
              text="Berikutnya"
            />
          ) : (
            <PaginationNext
              href="#"
              text="Berikutnya"
              aria-disabled="true"
              className="pointer-events-none opacity-50"
              tabIndex={-1}
            />
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
