"use client";

import { formatRupiah } from "@/lib/format";
import { useToko } from "@/components/TokoProvider";
import { buatUrlWhatsApp } from "@/lib/toko-validation";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TombolWhatsApp({ produk }) {
  const toko = useToko();
  const pesan = `Halo ${toko.nama}, saya tertarik dengan produk ${produk.nama} (${formatRupiah(produk.harga)}). Apakah masih tersedia?`;
  const url = buatUrlWhatsApp(toko.nomorWhatsApp, pesan);

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto"
      nativeButton={false}
      render={<a href={url} target="_blank" rel="noopener noreferrer" />}
    >
      <MessageCircleIcon aria-hidden="true" />
      Pesan via WhatsApp
    </Button>
  );
}
