"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Komponen filter pencarian produk (client component).
 * Menangani perubahan kategori via Select dan pengiriman form pencarian.
 * URL searchParams diperbarui agar bisa dibagikan dan bertahan setelah reload.
 */
export default function FilterPencarian({
  daftarKategori,
  kategoriDipilih,
  kataKunci,
  jumlahHasil,
  adaFilterAktif,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function buatUrl(kategori, q) {
    const params = new URLSearchParams();
    if (kategori) params.set("kategori", kategori);
    if (q) params.set("q", q);
    const query = params.toString();
    return query ? `/?${query}#produk` : "/#produk";
  }

  function handleKategoriChange(nilai) {
    router.push(buatUrl(nilai === "semua" ? "" : nilai, kataKunci));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const q = form.elements["q"]?.value?.trim() ?? "";
    router.push(buatUrl(kategoriDipilih, q));
  }

  function handleReset() {
    router.push("/#produk");
  }

  return (
    <div className="rounded-xl border bg-card p-4 sm:p-5">
      <form
        onSubmit={handleFormSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        {/* Input pencarian nama produk */}
        <div className="grid flex-1 gap-2">
          <Label htmlFor="cari-produk">Cari nama produk</Label>
          <div className="relative">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="cari-produk"
              name="q"
              type="search"
              defaultValue={kataKunci}
              key={kataKunci}
              className="pl-9"
              placeholder="Contoh: kopi, keripik, batik..."
            />
          </div>
        </div>

        {/* Select kategori */}
        {daftarKategori.length > 0 && (
          <div className="grid gap-2">
            <Label htmlFor="pilih-kategori">Kategori</Label>
            <Select
              value={kategoriDipilih || "semua"}
              onValueChange={handleKategoriChange}
            >
              <SelectTrigger
                id="pilih-kategori"
                className="h-9 w-full sm:w-44"
              >
                <SelectValue placeholder="Semua kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semua">Semua kategori</SelectItem>
                {daftarKategori.map((kat) => (
                  <SelectItem key={kat} value={kat}>
                    {kat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Tombol aksi */}
        <div className="flex gap-2">
          <Button type="submit">Cari</Button>
          {adaFilterAktif && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              aria-label="Hapus semua filter"
            >
              <XIcon className="size-4" aria-hidden="true" />
              Reset
            </Button>
          )}
        </div>
      </form>

      {/* Badge filter aktif + jumlah hasil */}
      {adaFilterAktif && (
        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Filter aktif:</span>
          {kataKunci && (
            <Badge variant="secondary">
              Kata kunci: &ldquo;{kataKunci}&rdquo;
            </Badge>
          )}
          {kategoriDipilih && (
            <Badge variant="secondary">Kategori: {kategoriDipilih}</Badge>
          )}
          <span className="ml-auto text-xs">
            {jumlahHasil}{" "}
            {jumlahHasil === 1 ? "produk ditemukan" : "produk ditemukan"}
          </span>
        </div>
      )}
    </div>
  );
}
