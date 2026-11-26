import "./globals.css";
import AppChrome from "@/components/layout/app-chrome";
import { toko } from "@/lib/toko";
import { Geist } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata = {
  title: toko.nama,
  description: toko.tagline,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={geist.variable}>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <TooltipProvider>
          <AppChrome>{children}</AppChrome>
        </TooltipProvider>
      </body>
    </html>
  );
}
