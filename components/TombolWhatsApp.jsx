import { formatRupiah } from "@/lib/format";
import { toko } from "@/lib/toko";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TombolWhatsApp({ produk }) {
  const pesan = `Halo ${toko.nama}, saya tertarik dengan produk ${produk.nama} (${formatRupiah(produk.harga)}). Apakah masih tersedia?`;
  const url = `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}`;

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
