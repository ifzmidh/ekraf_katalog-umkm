import Link from "next/link";
import { Plus } from "lucide-react";
import TabelProduk from "@/components/TabelProduk";
import { Button } from "@/components/ui/button";
import { buatKoneksiSesi } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanProdukAdmin() {
  let daftarProduk = [];
  let pesanError = null;
  try {
    const supabase = await buatKoneksiSesi();
    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, harga_diskon, stok, foto_url, kategori, is_terlaris")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Gagal mengambil daftar produk admin:", error.message);
      pesanError = "Gagal mengambil daftar produk dari database. Silakan muat ulang halaman.";
    } else daftarProduk = data ?? [];
  } catch (error) {
    console.error("Gagal terhubung ke Supabase:", error);
    pesanError = "Gagal terhubung ke database. Periksa pengaturan server dan coba lagi.";
  }
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-6"><div className="flex flex-wrap items-start justify-between gap-4"><p className="text-sm text-muted-foreground">Kelola produk yang tampil di katalog.</p><Button nativeButton={false} render={<Link href="/admin/produk/baru" />}><Plus aria-hidden="true" /> Tambah produk</Button></div>{pesanError ? <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{pesanError}</p> : daftarProduk.length ? <TabelProduk daftarProduk={daftarProduk} /> : <p className="rounded-lg border border-border bg-muted/40 px-4 py-8 text-sm text-muted-foreground">Belum ada produk.</p>}</div>;
}
