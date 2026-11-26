"use client";

import { useState } from "react";
import { ImageOffIcon } from "lucide-react";

export default function GambarProduk({ src, alt, className = "" }) {
  const [gagal, setGagal] = useState(false);

  if (!src || gagal) {
    return (
      <div className="flex aspect-square items-center justify-center bg-muted text-muted-foreground">
        <ImageOffIcon aria-hidden="true" className="size-8" />
        <span className="sr-only">Foto produk belum tersedia</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setGagal(true)}
    />
  );
}
