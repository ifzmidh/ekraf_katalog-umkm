"use client";

// US-18: Galeri beberapa foto produk.
// Komponen client hanya untuk interaksi ganti gambar aktif.
// Data foto sudah diproses di server dan dikirim sebagai props.

import { useState } from "react";
import { ImageOffIcon } from "lucide-react";

/**
 * @param {Object}   props
 * @param {string[]} props.fotos   – array URL foto (sudah termasuk foto_url utama di index 0)
 * @param {string}   props.nama    – nama produk untuk alt text
 */
export default function GaleriProduk({ fotos, nama }) {
  const [aktif, setAktif] = useState(0);
  const [gagalIndex, setGagalIndex] = useState({});

  if (!fotos || fotos.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <ImageOffIcon aria-hidden="true" className="size-10" />
        <span className="sr-only">Foto produk belum tersedia</span>
      </div>
    );
  }

  const indexAman = aktif < fotos.length ? aktif : 0;
  const urlAktif = fotos[indexAman];
  const utamaGagal = !urlAktif || Boolean(gagalIndex[indexAman]);

  function tandaiGagal(idx) {
    setGagalIndex((prev) => ({ ...prev, [idx]: true }));
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Gambar utama */}
      <div className="relative overflow-hidden rounded-xl bg-muted">
        {utamaGagal ? (
          <div className="flex aspect-square w-full items-center justify-center bg-muted text-muted-foreground">
            <ImageOffIcon aria-hidden="true" className="size-10" />
            <span className="sr-only">Foto tidak dapat dimuat</span>
          </div>
        ) : (
          <img
            key={urlAktif}
            src={urlAktif}
            alt={nama}
            className="aspect-square w-full object-cover transition-opacity duration-200"
            onError={() => tandaiGagal(indexAman)}
          />
        )}
      </div>

      {/* Thumbnail – tampilkan hanya jika ada lebih dari 1 foto */}
      {fotos.length > 1 && (
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Pilih foto produk"
        >
          {fotos.map((url, i) => {
            const thumbGagal = !url || Boolean(gagalIndex[i]);
            return (
              <button
                key={`${url}-${i}`}
                type="button"
                onClick={() => setAktif(i)}
                aria-label={`Foto produk ${i + 1}`}
                aria-pressed={indexAman === i}
                className={[
                  "h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  indexAman === i
                    ? "border-primary shadow-sm"
                    : "border-transparent opacity-60 hover:opacity-100",
                ].join(" ")}
              >
                {thumbGagal ? (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageOffIcon className="size-4" />
                  </div>
                ) : (
                  <img
                    src={url}
                    alt={`Thumbnail foto ${i + 1}`}
                    className="h-full w-full object-cover"
                    onError={() => tandaiGagal(i)}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
