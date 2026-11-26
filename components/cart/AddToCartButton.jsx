"use client";

import { ShoppingCartIcon } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";

export default function AddToCartButton({
  produk,
  quantity = 1,
  variant = "outline",
  size = "sm",
  className = "",
  label = "Tambah ke keranjang",
}) {
  const { addItem } = useCart();
  const stokHabis = typeof produk?.stok === "number" && produk.stok === 0;

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(produk, quantity);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={stokHabis}
      onClick={handleClick}
      className={className}
      aria-label={
        stokHabis
          ? `${produk?.nama || "Produk"} sedang habis`
          : `Tambah ${produk?.nama || "produk"} ke keranjang`
      }
    >
      <ShoppingCartIcon className="size-4" aria-hidden="true" />
      <span>{stokHabis ? "Stok habis" : label}</span>
    </Button>
  );
}
