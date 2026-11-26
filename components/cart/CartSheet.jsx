"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCartIcon,
  MessageCircleIcon,
  Trash2Icon,
  Loader2Icon,
  AlertCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import CartItem from "@/components/cart/CartItem";
import { useCart } from "@/components/cart/CartProvider";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { buildWhatsAppCheckoutUrl } from "@/lib/cart/cart-utils";
import { formatRupiah } from "@/lib/format";
import { useToko } from "@/components/TokoProvider";

export default function CartSheet() {
  const toko = useToko();
  const {
    items,
    hydrated,
    totalItems,
    totalPrice,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeItem,
    clearCart,
    syncWithServer,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    if (isOpen && hydrated && items.length > 0) {
      syncWithServer();
    }
    // Hanya sinkronkan saat sheet dibuka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, hydrated]);

  const hasInvalidItems = items.some(
    (item) =>
      item.unavailable ||
      item.stok === 0 ||
      (typeof item.stok === "number" && item.quantity > item.stok)
  );

  async function handleCheckoutWhatsApp() {
    if (items.length === 0 || isCheckingOut) return;

    setIsCheckingOut(true);
    try {
      const result = await syncWithServer();

      if (!result.ok) {
        toast.error(
          "Gagal memvalidasi stok produk ke server. Silakan coba lagi."
        );
        return;
      }

      if (!result.valid) {
        toast.error(
          "Beberapa produk di keranjang habis atau stok berubah. Perbarui keranjang sebelum memesan."
        );
        return;
      }

      const url = buildWhatsAppCheckoutUrl(result.items, toko.nomorWhatsApp);
      window.open(url, "_blank", "noopener,noreferrer");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCartIcon className="size-5 text-primary" aria-hidden="true" />
            <SheetTitle>Keranjang Belanja</SheetTitle>
          </div>
          <SheetDescription>
            {totalItems > 0
              ? `${totalItems} item siap dipesan ke ${toko.nama}`
              : "Tambahkan produk dari katalog untuk dipesan sekaligus."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!hydrated ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Memuat keranjang...
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ShoppingCartIcon className="size-6" aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-semibold">Keranjang masih kosong</p>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Pilih produk yang Anda inginkan lalu tekan &ldquo;Tambah ke
                keranjang&rdquo;.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-5"
                onClick={() => setIsOpen(false)}
              >
                Lihat katalog
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {hasInvalidItems && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive"
                >
                  <AlertCircleIcon
                    className="mt-0.5 size-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Ada produk yang habis, dihapus, atau melebihi stok. Hapus
                    atau sesuaikan jumlah sebelum memesan via WhatsApp.
                  </span>
                </div>
              )}

              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                  onCloseSheet={() => setIsOpen(false)}
                />
              ))}
            </div>
          )}
        </div>

        <SheetFooter className="border-t bg-muted/30 px-5 py-4">
          <div className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Total ({totalItems} item)
              </span>
              <span className="text-lg font-semibold text-[var(--price)] tabular-nums">
                {formatRupiah(totalPrice)}
              </span>
            </div>

            <Separator />

            <Button
              type="button"
              size="lg"
              className="w-full"
              disabled={items.length === 0 || hasInvalidItems || isCheckingOut}
              onClick={handleCheckoutWhatsApp}
            >
              {isCheckingOut ? (
                <>
                  <Loader2Icon
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Memvalidasi stok...
                </>
              ) : (
                <>
                  <MessageCircleIcon className="size-4" aria-hidden="true" />
                  Pesan Semua via WhatsApp
                </>
              )}
            </Button>

            {items.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="w-full text-muted-foreground hover:text-destructive"
                    />
                  }
                >
                  <Trash2Icon className="size-3.5" aria-hidden="true" />
                  Kosongkan keranjang
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Kosongkan keranjang?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Semua produk di keranjang akan dihapus. Tindakan ini tidak
                      dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction variant="destructive" onClick={clearCart}>
                      Ya, kosongkan
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
