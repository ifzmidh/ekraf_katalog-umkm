import Link from "next/link";
import {
  ArrowLeftIcon,
  ClockIcon,
  ExternalLinkIcon,
  MapPinIcon,
  MessageCircleIcon,
  PhoneIcon,
  StoreIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ambilDataToko } from "@/lib/toko-server";
import { buatUrlWhatsApp } from "@/lib/toko-validation";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const dataToko = await ambilDataToko();
  return {
    title: `Tentang ${dataToko.nama}`,
    description:
      dataToko.deskripsi ||
      `Profil, alamat, jam operasional, dan kontak ${dataToko.nama}.`,
  };
}

export default async function HalamanTentang() {
  const dataToko = await ambilDataToko();

  const punyaAlamat = Boolean(dataToko.alamat && dataToko.alamat.trim());
  const punyaJamBuka = Boolean(dataToko.jamBuka && dataToko.jamBuka.trim());
  const punyaDeskripsi = Boolean(
    dataToko.deskripsi && dataToko.deskripsi.trim()
  );
  const punyaWhatsApp = Boolean(
    dataToko.nomorWhatsApp && dataToko.nomorWhatsApp.trim()
  );

  const urlMaps = punyaAlamat
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        dataToko.alamat
      )}`
    : null;

  const urlWhatsApp = punyaWhatsApp
    ? buatUrlWhatsApp(
        dataToko.nomorWhatsApp,
        `Halo ${dataToko.nama}, saya ingin menanyakan informasi mengenai produk Anda.`
      )
    : null;

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
              <BreadcrumbPage>Tentang Toko</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="mt-6 flex flex-col gap-3">
          <Badge variant="secondary" className="w-fit gap-1.5">
            <StoreIcon className="size-3.5" aria-hidden="true" />
            Profil & Kontak Toko
          </Badge>
          <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-5xl">
            {dataToko.nama}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            Informasi resmi toko, jam operasional, lokasi, serta kontak langsung
            untuk pemesanan dan pertanyaan produk.
          </p>
        </header>

        <Separator className="my-8" />

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profil / Deskripsi Toko */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <StoreIcon className="size-5 text-primary" aria-hidden="true" />
                Profil Toko
              </CardTitle>
            </CardHeader>
            <CardContent>
              {punyaDeskripsi ? (
                <p className="max-w-prose whitespace-pre-line text-base leading-7 text-foreground/90">
                  {dataToko.deskripsi}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Deskripsi profil toko belum ditambahkan.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Alamat */}
          <Card className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPinIcon className="size-5 text-primary" aria-hidden="true" />
                Alamat Toko
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-between gap-4">
              {punyaAlamat ? (
                <>
                  <p className="whitespace-pre-line text-sm leading-6 text-foreground/90">
                    {dataToko.alamat}
                  </p>
                  {urlMaps && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit"
                      nativeButton={false}
                      render={
                        <a
                          href={urlMaps}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      }
                    >
                      <ExternalLinkIcon aria-hidden="true" />
                      Buka di Google Maps
                    </Button>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Alamat toko belum tersedia.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Jam Operasional */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClockIcon className="size-5 text-primary" aria-hidden="true" />
                Jam Operasional
              </CardTitle>
            </CardHeader>
            <CardContent>
              {punyaJamBuka ? (
                <p className="whitespace-pre-line text-sm leading-6 text-foreground/90">
                  {dataToko.jamBuka}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Jam operasional belum tersedia.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Kontak WhatsApp */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <PhoneIcon className="size-5 text-primary" aria-hidden="true" />
                Kontak & Pemesanan
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Nomor WhatsApp
                </p>
                {punyaWhatsApp ? (
                  <p className="text-lg font-semibold tabular-nums text-foreground">
                    +{dataToko.nomorWhatsApp}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nomor kontak belum tersedia.
                  </p>
                )}
              </div>

              {urlWhatsApp && (
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  nativeButton={false}
                  render={
                    <a
                      href={urlWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                >
                  <MessageCircleIcon aria-hidden="true" />
                  Hubungi via WhatsApp
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ArrowLeftIcon aria-hidden="true" />
            Kembali ke katalog
          </Button>
        </div>
      </article>
    </div>
  );
}
