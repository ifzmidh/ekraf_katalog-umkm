import Link from "next/link";
import { ArrowDownIcon } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KartuProduk from "@/components/KartuProduk";
import EmptyState from "@/components/design/EmptyState";
import SectionHeading from "@/components/design/SectionHeading";
import FilterPencarian from "@/components/FilterPencarian";
import { buttonVariants } from "@/components/ui/button";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const kategoriDipilih =
    typeof params?.kategori === "string" ? params.kategori.trim() : "";
  const kataKunci = typeof params?.q === "string" ? params.q.trim() : "";

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = buatKoneksiServer();

    let queryProduk = supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori")
      .order("created_at", { ascending: false });

    if (kategoriDipilih) {
      queryProduk = queryProduk.eq("kategori", kategoriDipilih);
    }

    if (kataKunci) {
      const polaCari = kataKunci.replace(/[%_\\]/g, "\\$&");
      queryProduk = queryProduk.ilike("nama", `%${polaCari}%`);
    }

    const [hasilProduk, hasilKategori] = await Promise.all([
      queryProduk,
      supabase.from("produk").select("kategori").not("kategori", "is", null),
    ]);

    if (hasilProduk.error) {
      console.error(
        "Gagal mengambil daftar produk:",
        hasilProduk.error.message,
      );
      pesanError =
        "Gagal mengambil daftar produk dari database. Silakan muat ulang halaman.";
    } else {
      daftarProduk = hasilProduk.data ?? [];
    }

    if (!hasilKategori.error && hasilKategori.data) {
      const kategoriUnik = new Set();
      for (const baris of hasilKategori.data) {
        const nilai =
          typeof baris.kategori === "string" ? baris.kategori.trim() : "";
        if (nilai) kategoriUnik.add(nilai);
      }
      daftarKategori = Array.from(kategoriUnik).sort((a, b) =>
        a.localeCompare(b, "id"),
      );
    }
  } catch (err) {
    console.error("Gagal terhubung ke Supabase:", err);
    pesanError =
      "Gagal terhubung ke database. Periksa pengaturan server dan coba lagi.";
  }

  const adaFilterAktif = Boolean(kategoriDipilih || kataKunci);

  return (
    <div className="-mx-4">
      <section className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
        <p className="text-sm font-semibold text-primary">
          Katalog produk lokal
        </p>
        <h1 className="mt-3 max-w-3xl font-heading text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          {toko.nama}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
          {toko.tagline}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="#produk" className={buttonVariants({ size: "lg" })}>
            Lihat produk
            <ArrowDownIcon aria-hidden="true" />
          </Link>
          <p className="text-sm text-muted-foreground">{toko.jamBuka}</p>
        </div>
      </section>

      <section
        id="produk"
        aria-labelledby="judul-produk"
        className="mx-auto max-w-5xl scroll-mt-20 px-4 pb-6"
      >
        <SectionHeading
          title="Produk Kami"
          description="Temukan pilihan produk UMKM yang dibuat dengan teliti."
        />

        <div className="mt-7">
          <FilterPencarian
            daftarKategori={daftarKategori}
            kategoriDipilih={kategoriDipilih}
            kataKunci={kataKunci}
            jumlahHasil={daftarProduk.length}
            adaFilterAktif={adaFilterAktif}
          />
        </div>

        <div className="mt-7">
          {pesanError ? (
            <div
              role="alert"
              className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
            >
              {pesanError}
            </div>
          ) : daftarProduk.length === 0 ? (
            <EmptyState
              title={
                adaFilterAktif
                  ? "Produk tidak ditemukan"
                  : "Produk belum tersedia"
              }
              description={
                adaFilterAktif
                  ? "Coba gunakan kata kunci atau kategori lain."
                  : "Produk akan segera ditampilkan di katalog ini."
              }
              actionLabel={
                adaFilterAktif ? "Tampilkan semua produk" : undefined
              }
              actionHref={adaFilterAktif ? "/#produk" : undefined}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3">
              {daftarProduk.map((produk) => (
                <KartuProduk key={produk.id} produk={produk} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
