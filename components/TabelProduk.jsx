"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { hapusProduk } from "@/app/admin/actions";
import { formatRupiah } from "@/lib/format";
import Tombol from "@/components/Tombol";

export default function TabelProduk({ daftarProduk }) {
  const router = useRouter();
  const [produkKonfirmasi, setProdukKonfirmasi] = useState(null);
  const [pesanError, setPesanError] = useState(null);
  const [sedangMenghapus, startTransition] = useTransition();

  function bukaKonfirmasi(produk) {
    setPesanError(null);
    setProdukKonfirmasi(produk);
  }

  function tutupKonfirmasi() {
    if (sedangMenghapus) return;
    setProdukKonfirmasi(null);
  }

  function konfirmasiHapus() {
    if (!produkKonfirmasi) return;

    const idTarget = produkKonfirmasi.id;
    setPesanError(null);

    startTransition(async () => {
      const hasil = await hapusProduk(idTarget);

      if (hasil?.error) {
        setPesanError(hasil.error);
        setProdukKonfirmasi(null);
        return;
      }

      setProdukKonfirmasi(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {pesanError ? (
        <p
          role="alert"
          className="rounded-lg border border-bahaya bg-permukaan px-4 py-3 text-sm text-bahaya"
        >
          {pesanError}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-garis">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="bg-permukaan text-teks-lembut">
            <tr>
              <th className="px-4 py-3 font-semibold">Produk</th>
              <th className="px-4 py-3 font-semibold">Kategori</th>
              <th className="px-4 py-3 font-semibold">Harga</th>
              <th className="px-4 py-3 font-semibold">Stok</th>
              <th className="px-4 py-3 font-semibold">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {daftarProduk.map((produk) => {
              const diskonAktif =
                typeof produk.harga_diskon === "number" &&
                produk.harga_diskon > 0 &&
                produk.harga_diskon < produk.harga;
              const stokHabis = typeof produk.stok === "number" && produk.stok === 0;

              return (
                <tr key={produk.id} className="border-t border-garis">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {produk.foto_url ? (
                        <img src={produk.foto_url} alt="" className="h-10 w-10 rounded-md object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-permukaan" />
                      )}
                      <div className="flex flex-col">
                        <span className="font-semibold">{produk.nama}</span>
                        {produk.is_terlaris ? (
                          <span className="text-xs font-medium text-amber-600">Terlaris</span>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-teks-lembut">{produk.kategori}</td>
                  <td className="px-4 py-3">
                    {diskonAktif ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-teks-lembut line-through">
                          {formatRupiah(produk.harga)}
                        </span>
                        <span className="font-semibold">{formatRupiah(produk.harga_diskon)}</span>
                      </div>
                    ) : (
                      formatRupiah(produk.harga)
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {stokHabis ? (
                      <span className="inline-block rounded-full bg-bahaya/10 px-2.5 py-0.5 text-xs font-semibold text-bahaya">
                        Habis (0)
                      </span>
                    ) : (
                      <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        {produk.stok ?? 0}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Tombol href={`/admin/produk/${produk.id}/ubah`} varian="garis">
                        Ubah
                      </Tombol>
                      <Tombol
                        type="button"
                        varian="bahaya"
                        onClick={() => bukaKonfirmasi(produk)}
                      >
                        Hapus
                      </Tombol>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {produkKonfirmasi ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="judul-konfirmasi-hapus"
          className="fixed inset-0 z-50 flex items-center justify-center bg-teks/40 px-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-garis bg-latar p-6 shadow-lg">
            <h2 id="judul-konfirmasi-hapus" className="text-lg font-extrabold text-teks">
              Hapus produk?
            </h2>
            <p className="mt-2 text-sm text-teks-lembut">
              Produk <span className="font-semibold text-teks">{produkKonfirmasi.nama}</span> akan dihapus dari katalog. Tindakan ini tidak bisa dibatalkan.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <Tombol
                type="button"
                varian="garis"
                onClick={tutupKonfirmasi}
                disabled={sedangMenghapus}
              >
                Batal
              </Tombol>
              <Tombol
                type="button"
                varian="bahaya"
                onClick={konfirmasiHapus}
                disabled={sedangMenghapus}
              >
                {sedangMenghapus ? "Menghapus..." : "Ya, hapus"}
              </Tombol>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
