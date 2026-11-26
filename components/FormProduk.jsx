"use client";

// US-08 / US-09: Form tambah & ubah produk.
// US-14: Tombol "Buat Deskripsi AI" memanggil /api/ai-deskripsi di server.
// US-18: Kelola foto utama + galeri foto tambahan (preview, urutan, hapus).
// US-19: Input stok (bilangan bulat >= 0).
// US-20: Input harga_diskon & checkbox is_terlaris.

import { useActionState, useEffect, useRef, useState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Loader2,
  Sparkles,
  Trash2Icon,
} from "lucide-react";

export default function FormProduk({ produk = {}, labelTombol, aksi }) {
  const [state, formAction, sedangProses] = useActionState(
    aksi || (async () => null),
    null
  );

  // State untuk tombol AI
  const [sedangAI, setSedangAI] = useState(false);
  const [deskripsi, setDeskripsi] = useState(produk.deskripsi ?? "");
  const refNama = useRef(null);
  const refKategori = useRef(null);

  // US-20: is_terlaris
  const [isTerlaris, setIsTerlaris] = useState(Boolean(produk.is_terlaris));

  // US-18: Preview foto utama baru
  const [previewUtama, setPreviewUtama] = useState(null);

  // US-18: Galeri foto lama (dari produk_foto) yang bisa diurutkan & dihapus
  const [fotoLama, setFotoLama] = useState(
    Array.isArray(produk.fotoTambahan) ? produk.fotoTambahan : []
  );
  const [hapusFotoIds, setHapusFotoIds] = useState([]);

  // US-18: Preview foto tambahan baru yang dipilih dari input file
  const [previewBaru, setPreviewBaru] = useState([]);

  useEffect(() => {
    return () => {
      if (previewUtama) URL.revokeObjectURL(previewUtama);
    };
  }, [previewUtama]);

  useEffect(() => {
    return () => {
      for (const item of previewBaru) {
        URL.revokeObjectURL(item.url);
      }
    };
  }, [previewBaru]);

  function handleFotoUtamaChange(e) {
    const file = e.target.files?.[0];
    if (previewUtama) URL.revokeObjectURL(previewUtama);
    setPreviewUtama(file ? URL.createObjectURL(file) : null);
  }

  function handleFotoTambahanChange(e) {
    for (const item of previewBaru) {
      URL.revokeObjectURL(item.url);
    }
    const files = Array.from(e.target.files || []);
    setPreviewBaru(
      files.map((file, idx) => ({
        key: `${file.name}-${file.size}-${idx}`,
        name: file.name,
        url: URL.createObjectURL(file),
      }))
    );
  }

  function geserFotoLama(index, arah) {
    const target = index + arah;
    if (target < 0 || target >= fotoLama.length) return;
    setFotoLama((prev) => {
      const salinan = [...prev];
      const [item] = salinan.splice(index, 1);
      salinan.splice(target, 0, item);
      return salinan;
    });
  }

  function hapusFotoLama(id) {
    setFotoLama((prev) => prev.filter((item) => item.id !== id));
    setHapusFotoIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  async function buatDeskripsiAI() {
    const nama = refNama.current?.value?.trim() ?? "";
    const kategori = refKategori.current?.value?.trim() ?? "";

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
      toast.success(
        "Deskripsi berhasil dibuat. Silakan edit sebelum menyimpan.",
        { id: toastId }
      );
    } catch {
      toast.error("Gagal menghubungi server. Periksa koneksi internet.", {
        id: toastId,
      });
    } finally {
      setSedangAI(false);
    }
  }

  return (
    <form
      action={aksi ? formAction : undefined}
      className="flex max-w-xl flex-col gap-4"
    >
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Harga Normal (Rp)"
          name="harga"
          type="number"
          min="0"
          defaultValue={produk.harga}
          required
        />

        {/* US-20: Harga diskon opsional */}
        <Input
          label="Harga Diskon (Rp, opsional)"
          name="harga_diskon"
          type="number"
          min="0"
          defaultValue={produk.harga_diskon ?? ""}
          placeholder="Kosongkan jika tidak diskon"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* US-19: Stok produk */}
        <Input
          label="Stok"
          name="stok"
          type="number"
          min="0"
          defaultValue={produk.stok ?? 0}
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
      </div>

      {/* US-20: Penanda manual Terlaris */}
      <div className="flex items-center gap-2.5 rounded-xl border border-garis bg-permukaan/50 px-3.5 py-2.5">
        <input
          type="hidden"
          name="is_terlaris"
          value={isTerlaris ? "true" : "false"}
        />
        <input
          id="is_terlaris"
          type="checkbox"
          checked={isTerlaris}
          onChange={(e) => setIsTerlaris(e.target.checked)}
          className="size-4 rounded border-garis accent-utama"
        />
        <label htmlFor="is_terlaris" className="cursor-pointer text-sm">
          <span className="font-semibold">Tandai sebagai Produk Terlaris</span>
          <span className="block text-xs text-teks-lembut">
            Menampilkan badge &ldquo;Terlaris&rdquo; di katalog dan halaman
            detail.
          </span>
        </label>
      </div>

      {/* Foto utama produk */}
      <div className="flex flex-col gap-2 text-sm">
        <label htmlFor="foto-utama" className="font-semibold">
          Foto utama produk
        </label>
        {previewUtama || produk.foto_url ? (
          <img
            src={previewUtama || produk.foto_url}
            alt={produk.nama || "Foto utama produk"}
            className="h-24 w-24 rounded-xl border border-garis bg-permukaan object-cover"
          />
        ) : null}
        <input
          id="foto-utama"
          type="file"
          name="foto"
          onChange={handleFotoUtamaChange}
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-permukaan file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-teks hover:file:bg-garis/40"
        />
        <span className="text-xs text-teks-lembut">
          Format JPG, PNG, WebP, GIF, atau SVG (maks. 2 MB), disimpan ke
          Supabase Storage.
        </span>
      </div>

      {/* US-18: Galeri foto tambahan */}
      <div className="flex flex-col gap-2.5 rounded-xl border border-garis bg-permukaan/30 p-3.5 text-sm">
        <div>
          <label htmlFor="foto-tambahan" className="font-semibold">
            Galeri foto tambahan (opsional)
          </label>
          <p className="text-xs text-teks-lembut">
            Unggah beberapa foto tambahan untuk ditampilkan di galeri detail
            produk.
          </p>
        </div>

        {/* Hidden inputs untuk urutan & penghapusan foto lama */}
        <input
          type="hidden"
          name="urutan_foto_lama"
          value={JSON.stringify(fotoLama.map((f) => f.id))}
        />
        <input
          type="hidden"
          name="hapus_foto_ids"
          value={JSON.stringify(hapusFotoIds)}
        />

        {fotoLama.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-teks-lembut">
              Foto galeri tersimpan ({fotoLama.length})
            </span>
            <div className="flex flex-wrap gap-2.5">
              {fotoLama.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-1 rounded-lg border border-garis bg-latar p-1.5"
                >
                  <img
                    src={item.foto_url}
                    alt={`Galeri ${idx + 1}`}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => geserFotoLama(idx, -1)}
                      disabled={idx === 0}
                      aria-label={`Geser foto ${idx + 1} ke kiri`}
                      className="rounded p-1 text-teks-lembut hover:bg-permukaan disabled:opacity-30"
                    >
                      <ArrowLeftIcon className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => geserFotoLama(idx, 1)}
                      disabled={idx === fotoLama.length - 1}
                      aria-label={`Geser foto ${idx + 1} ke kanan`}
                      className="rounded p-1 text-teks-lembut hover:bg-permukaan disabled:opacity-30"
                    >
                      <ArrowRightIcon className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => hapusFotoLama(item.id)}
                      aria-label={`Hapus foto ${idx + 1}`}
                      className="rounded p-1 text-bahaya hover:bg-bahaya/10"
                    >
                      <Trash2Icon className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <input
          id="foto-tambahan"
          type="file"
          name="foto_tambahan"
          multiple
          onChange={handleFotoTambahanChange}
          accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
          className="rounded-xl border border-garis bg-latar px-3.5 py-2.5 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-permukaan file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-teks hover:file:bg-garis/40"
        />

        {previewBaru.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-teks-lembut">
              Preview foto baru ({previewBaru.length} dipilih)
            </span>
            <div className="flex flex-wrap gap-2">
              {previewBaru.map((item) => (
                <img
                  key={item.key}
                  src={item.url}
                  alt={item.name}
                  className="h-16 w-16 rounded-lg border border-garis object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>

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
