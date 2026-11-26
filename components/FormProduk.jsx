"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";

// Dipakai untuk tambah produk (US-08) dan ubah produk (US-09). Keduanya bonus di jalur offline.
// Nama field sama dengan kolom tabel "produk".
export default function FormProduk({ produk = {}, labelTombol, aksi }) {
  const [state, formAction, sedangProses] = useActionState(
    aksi || (async () => null),
    null
  );

  return (
    <form action={aksi ? formAction : undefined} className="flex max-w-xl flex-col gap-4">
      {state?.error ? (
        <p
          role="alert"
          className="rounded-lg border border-bahaya/40 bg-bahaya/5 px-3 py-2 text-sm font-medium text-bahaya"
        >
          {state.error}
        </p>
      ) : null}
      <Input label="Nama produk" name="nama" defaultValue={produk.nama} required />
      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />
      <Input label="Kategori" name="kategori" defaultValue={produk.kategori} />
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium">Foto produk</span>
        {produk.foto_url ? (
          <img
            src={produk.foto_url}
            alt={produk.nama || "Foto produk"}
            className="h-24 w-24 rounded-xl border border-garis bg-permukaan object-cover"
          />
        ) : null}
        <input
          type="file"
          name="foto"
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-permukaan file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-teks hover:file:bg-garis/40"
        />
        <span className="text-xs text-teks-lembut">
          Format JPG, PNG, WebP, GIF, atau SVG (maks. 2 MB), disimpan ke Supabase Storage.
        </span>
      </label>
      <Input label="Deskripsi" name="deskripsi" textarea defaultValue={produk.deskripsi} />
      <div className="flex gap-3">
        <Tombol type="submit" disabled={sedangProses}>
          {sedangProses ? "Menyimpan..." : labelTombol}
        </Tombol>
        <Tombol href="/admin" varian="garis">
          Batal
        </Tombol>
      </div>
    </form>
  );
}
