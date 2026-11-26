import Link from "next/link";
import { Package, Plus, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import StatCard from "@/components/design/StatCard";
import { formatRupiah } from "@/lib/format";
import { buatKoneksiSesi } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  let totalProduk = 0;
  let kategori = [];
  let produkTerbaru = [];
  let pesanError = null;

  try {
    const supabase = await buatKoneksiSesi();
    const [hasilTotal, hasilKategori, hasilTerbaru] = await Promise.all([
      supabase.from("produk").select("id", { count: "exact", head: true }),
      supabase.from("produk").select("kategori"),
      supabase.from("produk").select("id, nama, harga, kategori").order("created_at", { ascending: false }).limit(5),
    ]);

    if (hasilTotal.error || hasilKategori.error || hasilTerbaru.error) {
      console.error("Gagal mengambil statistik dashboard:", hasilTotal.error || hasilKategori.error || hasilTerbaru.error);
      pesanError = "Statistik belum dapat dimuat. Silakan muat ulang halaman.";
    } else {
      totalProduk = hasilTotal.count ?? 0;
      const jumlahKategori = new Map();
      for (const produk of hasilKategori.data ?? []) {
        const namaKategori = produk.kategori?.trim() || "Tanpa kategori";
        jumlahKategori.set(namaKategori, (jumlahKategori.get(namaKategori) ?? 0) + 1);
      }
      kategori = [...jumlahKategori.entries()].map(([nama, total]) => ({ nama, total })).sort((a, b) => b.total - a.total || a.nama.localeCompare(b.nama, "id"));
      produkTerbaru = hasilTerbaru.data ?? [];
    }
  } catch (error) {
    console.error("Gagal terhubung ke database untuk dashboard:", error);
    pesanError = "Koneksi ke database belum tersedia. Periksa pengaturan server lalu coba lagi.";
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <p className="text-sm text-muted-foreground">Ringkasan katalog toko hari ini.</p>
      {pesanError ? <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{pesanError}</p> : null}
      <section aria-label="Statistik produk" className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total produk" value={totalProduk} description="Produk yang tercatat di katalog" icon={Package} />
        <StatCard label="Kategori" value={kategori.length} description="Kategori dengan produk" icon={Tags} />
      </section>
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="py-0"><CardHeader className="border-b py-4"><CardTitle>Produk terbaru</CardTitle><CardDescription>Lima produk yang terakhir ditambahkan ke katalog.</CardDescription></CardHeader><CardContent className="p-0">
          {produkTerbaru.length ? <Table><TableHeader><TableRow><TableHead>Produk</TableHead><TableHead className="hidden sm:table-cell">Kategori</TableHead><TableHead className="text-right">Harga</TableHead></TableRow></TableHeader><TableBody>{produkTerbaru.map((produk) => <TableRow key={produk.id}><TableCell className="max-w-40 truncate font-medium sm:max-w-none">{produk.nama}</TableCell><TableCell className="hidden sm:table-cell"><Badge variant="secondary">{produk.kategori || "Tanpa kategori"}</Badge></TableCell><TableCell className="text-right font-medium">{formatRupiah(produk.harga)}</TableCell></TableRow>)}</TableBody></Table> : <p className="px-4 py-8 text-sm text-muted-foreground">Belum ada produk di katalog.</p>}
        </CardContent></Card>
        <Card className="py-0"><CardHeader className="border-b py-4"><CardTitle>Produk per kategori</CardTitle><CardDescription>Jumlah produk yang tersedia.</CardDescription></CardHeader><CardContent className="space-y-3 py-4">
          {kategori.length ? kategori.map((item) => <div key={item.nama} className="flex items-center justify-between gap-4 text-sm"><span className="min-w-0 truncate text-muted-foreground">{item.nama}</span><Badge variant="outline">{item.total}</Badge></div>) : <p className="text-sm text-muted-foreground">Kategori akan tampil setelah produk ditambahkan.</p>}
        </CardContent></Card>
      </section>
      <section><h2 className="mb-3 text-base font-semibold">Aksi cepat</h2><div className="flex flex-wrap gap-3"><Button nativeButton={false} render={<Link href="/admin/produk/baru" />}><Plus aria-hidden="true" /> Tambah produk</Button><Button variant="outline" nativeButton={false} render={<Link href="/admin/produk" />}>Lihat semua produk</Button></div></section>
    </div>
  );
}
