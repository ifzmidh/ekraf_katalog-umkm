"use client";

import Link from "next/link";
import { MinusIcon, PlusIcon, Trash2Icon, AlertTriangleIcon } from "lucide-react";
import GambarProduk from "@/components/GambarProduk";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { getHargaAktif, isDiskonAktif } from "@/lib/cart/cart-utils";

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
  onCloseSheet,
}) {
  const hargaAktif = getHargaAktif(item);
  const diskon = isDiskonAktif(item);
  const subtotal = hargaAktif * item.quantity;

  const isUnavailable = Boolean(item.unavailable);
  const isOutOfStock = typeof item.stok === "number" && item.stok === 0;
  const exceedsStock =
    typeof item.stok === "number" && item.stok > 0 && item.quantity > item.stok;
  const atMaxStock =
    typeof item.stok === "number" && item.stok > 0 && item.quantity >= item.stok;

  return (
    <div className="flex gap-3 rounded-xl border bg-card p-3">
      <Link
        href={`/produk/${item.productId}`}
        onClick={onCloseSheet}
        className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        <GambarProduk
          src={item.foto_url}
          alt={item.nama}
          className="size-full object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/produk/${item.productId}`}
            onClick={onCloseSheet}
            className="line-clamp-2 text-sm font-semibold leading-snug hover:text-primary"
          >
            {item.nama}
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onRemove(item.productId)}
            aria-label={`Hapus ${item.nama} dari keranjang`}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2Icon className="size-3.5" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium text-[var(--price)]">
            {formatRupiah(hargaAktif)}
          </span>
          {diskon && (
            <span className="text-[11px] text-muted-foreground line-through">
              {formatRupiah(item.harga)}
            </span>
          )}
        </div>

        {(isUnavailable || isOutOfStock || exceedsStock) && (
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-destructive">
            <AlertTriangleIcon className="size-3.5 shrink-0" aria-hidden="true" />
            <span>
              {isUnavailable
                ? "Produk tidak lagi tersedia."
                : isOutOfStock
                  ? "Stok produk sedang habis."
                  : `Jumlah melebihi stok tersisa (${item.stok}).`}
            </span>
          </div>
        )}

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              disabled={item.quantity <= 1 || isUnavailable || isOutOfStock}
              onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
              aria-label={`Kurangi jumlah ${item.nama}`}
            >
              <MinusIcon className="size-3" aria-hidden="true" />
            </Button>
            <span
              className="min-w-6 text-center text-xs font-semibold tabular-nums"
              aria-label={`Jumlah ${item.nama}`}
            >
              {item.quantity}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              disabled={atMaxStock || isUnavailable || isOutOfStock}
              onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
              aria-label={`Tambah jumlah ${item.nama}`}
            >
              <PlusIcon className="size-3" aria-hidden="true" />
            </Button>
          </div>

          <span className="text-xs font-semibold text-foreground tabular-nums">
            {formatRupiah(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
