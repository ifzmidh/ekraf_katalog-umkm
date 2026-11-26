import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import FavoritesView from "@/components/favorites/FavoritesView";
import PageHeader from "@/components/design/PageHeader";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Produk Favorit",
  description: "Daftar produk UMKM favorit yang tersimpan di browser Anda.",
};

export default function HalamanFavorit() {
  return (
    <div className="-mx-4">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:py-12">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/#produk" />}
          >
            <ArrowLeftIcon aria-hidden="true" />
            Kembali ke katalog
          </Button>
        </div>

        <PageHeader
          title="Produk Favorit"
          description="Produk yang Anda tandai sebagai favorit tersimpan secara lokal di browser ini."
        />

        <div className="mt-8">
          <FavoritesView />
        </div>
      </section>
    </div>
  );
}
