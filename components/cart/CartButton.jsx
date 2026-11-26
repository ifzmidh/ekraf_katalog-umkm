"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";

export default function CartButton() {
  const { totalItems, hydrated, setIsOpen } = useCart();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => setIsOpen(true)}
      className="relative shrink-0 gap-1.5"
      aria-label={
        hydrated && totalItems > 0
          ? `Buka keranjang (${totalItems} item)`
          : "Buka keranjang"
      }
    >
      <ShoppingCartIcon className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Keranjang</span>
      {hydrated && totalItems > 0 && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[11px] font-bold leading-none text-primary-foreground tabular-nums">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Button>
  );
}
