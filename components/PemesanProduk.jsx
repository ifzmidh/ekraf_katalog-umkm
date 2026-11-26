"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";

/**
 * Komponen client untuk memilih jumlah dan varian produk sebelum memesan.
 * State (jumlah, varian) dikelola di sisi klien karena bersifat interaktif.
 * Pesan WhatsApp disusun dari state tersebut saat tombol diklik.
 */
export default function PemesanProduk({ produk }) {
  const [jumlah, setJumlah] = useState(1);
  const [varian, setVarian] = useState("");

  function kurangi() {
    setJumlah((j) => Math.max(1, j - 1));
  }

  function tambah() {
    setJumlah((j) => j + 1);
  }

  function handleJumlahInput(e) {
    const nilai = parseInt(e.target.value, 10);
    if (!isNaN(nilai) && nilai >= 1) {
      setJumlah(nilai);
    }
  }

  function buatPesan() {
    const bagianVarian = varian.trim() ? `, varian: ${varian.trim()}` : "";
    return (
      `Halo ${toko.nama}, saya ingin memesan:\n` +
      `- Produk: ${produk.nama}\n` +
      `- Harga satuan: ${formatRupiah(produk.harga)}\n` +
      `- Jumlah: ${jumlah}${bagianVarian}\n\n` +
      `Apakah masih tersedia?`
    );
  }

  const urlWhatsApp = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(buatPesan())}`;

  return (
    <div className="flex w-full flex-col gap-5 sm:w-auto sm:min-w-72">
      {/* Pemilih jumlah */}
      <div className="grid gap-2">
        <Label htmlFor="jumlah-produk">Jumlah</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={kurangi}
            disabled={jumlah <= 1}
            aria-label="Kurangi jumlah"
          >
            <MinusIcon aria-hidden="true" />
          </Button>
          <Input
            id="jumlah-produk"
            type="number"
            min="1"
            value={jumlah}
            onChange={handleJumlahInput}
            className="w-16 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label="Jumlah produk"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={tambah}
            aria-label="Tambah jumlah"
          >
            <PlusIcon aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Input varian opsional */}
      <div className="grid gap-2">
        <Label htmlFor="varian-produk">
          Varian{" "}
          <span className="text-xs font-normal text-muted-foreground">
            (opsional)
          </span>
        </Label>
        <Input
          id="varian-produk"
          type="text"
          value={varian}
          onChange={(e) => setVarian(e.target.value)}
          placeholder="Contoh: merah, ukuran L, rasa pedas..."
          maxLength={100}
        />
      </div>

      {/* Tombol WhatsApp */}
      <Button
        size="lg"
        className="w-full"
        nativeButton={false}
        render={
          <a href={urlWhatsApp} target="_blank" rel="noopener noreferrer" />
        }
      >
        <MessageCircleIcon aria-hidden="true" />
        Pesan via WhatsApp
      </Button>

      {/* Tombol kembali */}
      <Button
        variant="outline"
        className="w-full"
        nativeButton={false}
        render={<Link href="/" />}
      >
        Kembali ke katalog
      </Button>
    </div>
  );
}
