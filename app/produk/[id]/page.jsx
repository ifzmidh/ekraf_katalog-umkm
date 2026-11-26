import { ImageOffIcon } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PemesanProduk from "@/components/PemesanProduk";
import { Badge } from "@/components/ui/badge";
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

export default async function HalamanDetailProduk({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const supabase = buatKoneksiServer();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil detail produk:", error.message);
  }

  if (!produk) {
    notFound();
  }

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
          <Card className="overflow-hidden bg-card p-0">
            {produk.foto_url ? (
              <img
                src={produk.foto_url}
                alt={produk.nama}
                className="aspect-square w-full bg-muted object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-muted text-muted-foreground">
                <ImageOffIcon aria-hidden="true" className="size-10" />
                <span className="sr-only">Foto produk belum tersedia</span>
              </div>
            )}
          </Card>

          <div className="flex flex-col items-start">
            {produk.kategori ? (
              <Badge variant="secondary">{produk.kategori}</Badge>
            ) : null}
            <h1 className="mt-4 font-heading text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              {produk.nama}
            </h1>
            <p className="mt-5 text-2xl font-semibold tracking-tight text-[var(--price)]">
              {formatRupiah(produk.harga)}
            </p>
            <Separator className="my-6" />
            <div className="max-w-prose text-base leading-7 text-muted-foreground">
              {produk.deskripsi || "Deskripsi produk belum tersedia."}
            </div>
            <div className="mt-8 w-full sm:w-auto">
              <PemesanProduk produk={produk} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
