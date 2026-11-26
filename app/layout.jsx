import "./globals.css";
import AppChrome from "@/components/layout/app-chrome";
import { toko } from "@/lib/toko";
import { Geist } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

// US-13: metadata mencakup manifest (Next.js otomatis menambah <link rel="manifest">).
export const metadata = {
  title: toko.nama,
  description: toko.tagline,
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={geist.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <TooltipProvider>
          <AppChrome>{children}</AppChrome>
          <Toaster richColors closeButton />
        </TooltipProvider>
      </body>
    </html>
  );
}
