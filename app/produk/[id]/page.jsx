import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import PemesanProduk from "@/components/PemesanProduk";
import KartuProduk from "@/components/KartuProduk";
import GaleriProduk from "@/components/GaleriProduk";
import SectionHeading from "@/components/design/SectionHeading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatRupiah } from "@/lib/format";
import { buatKoneksiServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// US-20: hitung apakah badge "Baru" aktif (produk dibuat <= 7 hari)
function hitungIsBaru(createdAt) {
  if (!createdAt) return false;
  const selisihMs = Date.now() - new Date(createdAt).getTime();
  return selisihMs <= 7 * 24 * 60 * 60 * 1000;
}

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const supabase = buatKoneksiServer();

  // US-18: select foto_url (utama) + kolom baru US-19/US-20
  const [hasilProduk, hasilFoto, hasilTerkaitTemp] = await Promise.all([
    supabase
      .from("produk")
      .select("id, nama, harga, harga_diskon, stok, deskripsi, foto_url, kategori, is_terlaris, created_at")
      .eq("id", id)
      .maybeSingle(),
    // US-18: foto tambahan dari tabel produk_foto
    supabase
      .from("produk_foto")
      .select("foto_url, urutan")
      .eq("produk_id", id)
      .order("urutan", { ascending: true }),
    // US-17: produk terkait (diproses setelah produk diambil)
    null,
  ]);

  if (hasilProduk.error) {
    console.error("Gagal mengambil detail produk:", hasilProduk.error.message);
  }

  const produk = hasilProduk.data;
  if (!produk) {
    notFound();
  }

  // US-18: Susun daftar foto: foto_url utama (produk.foto_url) di index 0, lalu foto dari produk_foto
  const fotoTambahan = hasilFoto.data?.map((f) => f.foto_url) ?? [];
  const daftarFoto = [
    ...(produk.foto_url ? [produk.foto_url] : []),
    ...fotoTambahan,
  ];

  // US-17: Ambil produk terkait
  let produkTerkait = [];
  if (produk.kategori) {
    const { data: hasilTerkait, error: errorTerkait } = await supabase
      .from("produk")
      .select("id, nama, harga, harga_diskon, stok, foto_url, kategori, is_terlaris, created_at")
      .eq("kategori", produk.kategori)
      .neq("id", produk.id)
      .order("created_at", { ascending: false })
      .limit(4);

    if (errorTerkait) {
      console.error("Gagal mengambil produk terkait:", errorTerkait.message);
    } else {
      produkTerkait = hasilTerkait ?? [];
    }
  }

  // US-19
  const stokHabis = typeof produk.stok === "number" && produk.stok === 0;

  // US-20
  const diskonAktif =
    typeof produk.harga_diskon === "number" &&
    produk.harga_diskon > 0 &&
    produk.harga_diskon < produk.harga;
  const isBaru = hitungIsBaru(produk.created_at);
  const isTerlaris = Boolean(produk.is_terlaris);

  return (
    <div className="-mx-4">
      <article className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/" />}>
                Katalog
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{produk.nama}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-7 grid items-start gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(20rem,0.92fr)] lg:gap-12">
          {/* US-18: Galeri foto */}
          <Card className="overflow-hidden bg-card p-4">
            <GaleriProduk fotos={daftarFoto} nama={produk.nama} />
          </Card>

          <div className="flex flex-col items-start">
            {/* US-20: Badge Baru & Terlaris */}
            {(isBaru || isTerlaris) && (
              <div className="mb-3 flex gap-2">
                {isBaru && (
                  <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                    Baru
                  </span>
                )}
                {isTerlaris && (
                  <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-bold text-white">
                    Terlaris
                  </span>
                )}
              </div>
            )}

            {produk.kategori ? (
              <Badge variant="secondary">{produk.kategori}</Badge>
            ) : null}
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {produk.nama}
            </h1>

            {/* US-20: Harga dengan coret jika diskon aktif */}
            <div className="mt-5">
              {diskonAktif ? (
                <div className="flex flex-col gap-0.5">
                  <p className="text-base text-muted-foreground line-through">
                    {formatRupiah(produk.harga)}
                  </p>
                  <p className="text-2xl font-semibold tracking-tight text-[var(--price)]">
                    {formatRupiah(produk.harga_diskon)}
                  </p>
                </div>
              ) : (
                <p className="text-2xl font-semibold tracking-tight text-[var(--price)]">
                  {formatRupiah(produk.harga)}
                </p>
              )}
            </div>

            {/* US-19: Status stok */}
            <div className="mt-3">
              {stokHabis ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
                  <span className="size-1.5 rounded-full bg-destructive" />
                  Habis
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  Tersedia
                </span>
              )}
            </div>

            <Separator className="my-6" />

            <div className="max-w-prose text-base leading-7 text-muted-foreground">
              {produk.deskripsi || "Deskripsi produk belum tersedia."}
            </div>

            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:min-w-72">
              {/* US-19: Jika stok habis, tampilkan keterangan & sembunyikan PemesanProduk */}
              {stokHabis ? (
                <div
                  role="alert"
                  className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                  Maaf, produk ini sedang habis dan belum bisa dipesan.
                </div>
              ) : (
                <PemesanProduk produk={produk} />
              )}
              <Button
                variant="outline"
                className="w-full"
                nativeButton={false}
                render={<Link href="/" />}
              >
                <ArrowLeftIcon aria-hidden="true" />
                Kembali ke katalog
              </Button>
            </div>
          </div>
        </div>

        {/* US-17: Section Produk Terkait */}
        {produkTerkait.length > 0 && (
          <section
            aria-labelledby="judul-terkait"
            className="mt-14 border-t pt-10"
          >
            <SectionHeading
              id="judul-terkait"
              title="Produk Terkait"
              description={`Produk lain dalam kategori ${produk.kategori}.`}
            />
            <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-4">
              {produkTerkait.map((p) => (
                <KartuProduk key={p.id} produk={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
