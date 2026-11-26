import "./globals.css";
import AppChrome from "@/components/layout/app-chrome";
import { TokoProvider } from "@/components/TokoProvider";
import { CartProvider } from "@/components/cart/CartProvider";
import CartSheet from "@/components/cart/CartSheet";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import { ambilDataToko } from "@/lib/toko-server";
import { Geist } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

// US-13 & US-43: metadata dinamis memakai nama toko dari database (fallback lib/toko.js)
export async function generateMetadata() {
  const dataToko = await ambilDataToko();
  return {
    title: dataToko.nama,
    description: dataToko.deskripsi || dataToko.tagline,
    manifest: "/manifest.webmanifest",
    icons: {
      icon: "/icons/icon-192.png",
      apple: "/icons/icon-192.png",
    },
  };
}

export default async function RootLayout({ children }) {
  const dataToko = await ambilDataToko();

  return (
    <html lang="id" className={geist.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <TooltipProvider>
          <TokoProvider initialToko={dataToko}>
            <FavoritesProvider>
              <CartProvider>
                <AppChrome>{children}</AppChrome>
                <CartSheet />
                <Toaster richColors closeButton />
              </CartProvider>
            </FavoritesProvider>
          </TokoProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
