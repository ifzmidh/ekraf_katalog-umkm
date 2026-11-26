import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { buatKoneksiServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let daftarProduk = [];
  let pesanError = null;

  try {
    const supabase = buatKoneksiServer();
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil daftar produk admin:", error.message);
      pesanError = "Gagal mengambil daftar produk dari database. Silakan muat ulang halaman.";
    } else {
      daftarProduk = data ?? [];
    }
  } catch (err) {
    console.error("Gagal terhubung ke Supabase:", err);
    pesanError = "Gagal terhubung ke database. Periksa pengaturan server dan coba lagi.";
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>
      {pesanError ? (
        <p
          role="alert"
          className="rounded-lg border border-bahaya bg-permukaan px-4 py-3 text-sm text-bahaya"
        >
          {pesanError}
        </p>
      ) : daftarProduk.length === 0 ? (
        <p className="rounded-lg border border-garis bg-permukaan px-4 py-6 text-sm text-teks-lembut">
          Belum ada produk
        </p>
      ) : (
        <TabelProduk daftarProduk={daftarProduk} />
      )}
    </div>
  );
}
