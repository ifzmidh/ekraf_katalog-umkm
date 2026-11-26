import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import GambarProduk from "@/components/GambarProduk";
import { formatRupiah } from "@/lib/format";

// US-20: hitung apakah produk "baru" (dibuat <= 7 hari lalu) di server/client
function hitungIsBaru(createdAt) {
  if (!createdAt) return false;
  const selisihMs = Date.now() - new Date(createdAt).getTime();
  return selisihMs <= 7 * 24 * 60 * 60 * 1000;
}

export default function ProductCard({ produk }) {
  // US-19: status stok
  const stokHabis = typeof produk.stok === "number" && produk.stok === 0;

  // US-20: harga & badge
  const diskonAktif =
    typeof produk.harga_diskon === "number" &&
    produk.harga_diskon > 0 &&
    produk.harga_diskon < produk.harga;
  const isBaru = hitungIsBaru(produk.created_at);
  const isTerlaris = Boolean(produk.is_terlaris);

  return (
    <Link href={`/produk/${produk.id}`} className="group block focus-visible:rounded-xl">
      <Card className="h-full gap-0 py-0 transition-shadow duration-200 group-hover:shadow-md">
        {/* Wrapper gambar – posisi relatif untuk badge */}
        <div className="relative overflow-hidden">
          <GambarProduk
            src={produk.foto_url}
            alt={produk.nama}
            className={[
              "aspect-square w-full bg-muted object-cover transition-transform duration-300 group-hover:scale-[1.02]",
              stokHabis ? "opacity-60 grayscale" : "",
            ].join(" ")}
          />

          {/* Badge pojok kiri atas – US-20 Baru & Terlaris */}
          {(isBaru || isTerlaris) && (
            <div className="absolute left-2 top-2 flex flex-col gap-1">
              {isBaru && (
                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold leading-tight text-white shadow">
                  Baru
                </span>
              )}
              {isTerlaris && (
                <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold leading-tight text-white shadow">
                  Terlaris
                </span>
              )}
            </div>
          )}

          {/* Badge stok habis – US-19 */}
          {stokHabis && (
            <div className="absolute inset-0 flex items-end justify-center pb-3">
              <span className="rounded-full bg-destructive/90 px-3 py-1 text-xs font-bold text-white shadow">
                Habis
              </span>
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-2 p-4">
          {produk.kategori ? (
            <Badge variant="secondary" className="w-fit">
              {produk.kategori}
            </Badge>
          ) : null}
          <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">
            {produk.nama}
          </h3>

          {/* US-20: Harga dengan coret jika ada diskon */}
          <div className="mt-auto flex flex-col pt-1">
            {diskonAktif ? (
              <>
                <p className="text-xs text-muted-foreground line-through">
                  {formatRupiah(produk.harga)}
                </p>
                <p className="text-lg font-semibold tracking-tight text-[var(--price)]">
                  {formatRupiah(produk.harga_diskon)}
                </p>
              </>
            ) : (
              <p className="text-lg font-semibold tracking-tight text-[var(--price)]">
                {formatRupiah(produk.harga)}
              </p>
            )}

            {/* US-19: label "Tersedia" jika stok > 0 */}
            {!stokHabis && typeof produk.stok === "number" && (
              <p className="mt-0.5 text-[11px] font-medium text-emerald-600">
                Tersedia
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

