import Link from "next/link";
import { ImageOffIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format";

export default function ProductCard({ produk }) {
  return (
    <Link href={`/produk/${produk.id}`} className="group block focus-visible:rounded-xl">
      <Card className="h-full gap-0 py-0 transition-shadow duration-200 group-hover:shadow-md">
        {produk.foto_url ? (
          <img
            src={produk.foto_url}
            alt={produk.nama}
            className="aspect-square w-full bg-muted object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex aspect-square items-center justify-center bg-muted text-muted-foreground">
            <ImageOffIcon aria-hidden="true" className="size-8" />
            <span className="sr-only">Foto produk belum tersedia</span>
          </div>
        )}
        <CardContent className="flex flex-1 flex-col gap-2 p-4">
          {produk.kategori ? <Badge variant="secondary" className="w-fit">{produk.kategori}</Badge> : null}
          <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">
            {produk.nama}
          </h3>
          <p className="mt-auto pt-1 text-lg font-semibold tracking-tight text-[var(--price)]">
            {formatRupiah(produk.harga)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
