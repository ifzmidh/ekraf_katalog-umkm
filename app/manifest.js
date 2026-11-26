// US-13: Web App Manifest – diperlukan agar katalog dapat di-install sebagai PWA.
// Next.js akan menyajikannya secara otomatis di /manifest.webmanifest.
export default function manifest() {
  return {
    name: "Raja Roster – Katalog UMKM",
    short_name: "Raja Roster",
    description:
      "Produk roster beton modern minimalis, ornamen dinding, dan batu alam berkualitas",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
