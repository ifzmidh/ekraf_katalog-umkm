"use client";

// US-08 / US-09: Form tambah & ubah produk.
// US-14: Tombol "Buat Deskripsi AI" memanggil /api/ai-deskripsi di server
//         dan mengisi textarea deskripsi dengan hasilnya (admin masih bisa mengedit).

import { useActionState, useRef, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";

export default function FormProduk({ produk = {}, labelTombol, aksi }) {
  const [state, formAction, sedangProses] = useActionState(
    aksi || (async () => null),
    null
  );

  // State untuk tombol AI
  const [sedangAI, setSedangAI] = useState(false);
  // Nilai deskripsi dikontrol agar bisa diisi oleh AI
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi ?? "");
  // Ref ke field nama & kategori untuk membaca nilainya saat tombol diklik
  const refNama = useRef(null);
  const refKategori = useRef(null);

  async function buatDeskripsiAI() {
    const nama = refNama.current?.value?.trim() ?? "";
    const kategori = refKategori.current?.value?.trim() ?? "";

    // Validasi sisi klien sebelum memanggil API
    if (!nama || nama.length < 2) {
      toast.error("Isi nama produk terlebih dahulu (minimal 2 karakter).");
      refNama.current?.focus();
      return;
    }

    setSedangAI(true);
    const toastId = toast.loading("Sedang membuat deskripsi AI…");

    try {
      const res = await fetch("/api/ai-deskripsi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, kategori }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.error ?? "Gagal membuat deskripsi.", { id: toastId });
        return;
      }

      setDeskripsi(data.deskripsi);
      toast.success("Deskripsi berhasil dibuat. Silakan edit sebelum menyimpan.", {
        id: toastId,
      });
    } catch {
      toast.error("Gagal menghubungi server. Periksa koneksi internet.", {
        id: toastId,
      });
    } finally {
      setSedangAI(false);
    }
  }

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

      {/* Nama produk – dibutuhkan oleh tombol AI */}
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Nama produk
        <input
          ref={refNama}
          name="nama"
          type="text"
          defaultValue={produk.nama}
          required
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </label>

      <Input
        label="Harga (Rp)"
        name="harga"
        type="number"
        min="0"
        defaultValue={produk.harga}
        required
      />

      {/* Kategori – dibutuhkan oleh tombol AI */}
      <label className="flex flex-col gap-1.5 text-sm font-semibold">
        Kategori
        <input
          ref={refKategori}
          name="kategori"
          type="text"
          defaultValue={produk.kategori}
          className="w-full rounded-lg border border-garis bg-latar px-3 py-2.5 text-base text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
        />
      </label>

      {/* Foto produk */}
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

      {/* US-14: Deskripsi + tombol AI */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Deskripsi</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={sedangAI}
            onClick={buatDeskripsiAI}
            className="gap-1.5"
          >
            {sedangAI ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Sparkles className="size-3.5" />
            )}
            {sedangAI ? "Membuat…" : "Buat Deskripsi AI"}
          </Button>
        </div>
        {/* Textarea terkontrol agar bisa diisi oleh AI */}
        <Textarea
          name="deskripsi"
          rows={5}
          value={deskripsi}
          onChange={(e) => setDeskripsi(e.target.value)}
          placeholder="Tulis deskripsi produk, atau klik tombol &ldquo;Buat Deskripsi AI&rdquo; di atas."
          className="resize-y"
        />
        <p className="text-right text-xs text-teks-lembut">
          {deskripsi.length}/500 karakter
        </p>
      </div>

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
