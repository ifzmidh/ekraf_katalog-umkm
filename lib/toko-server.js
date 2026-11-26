import { cache } from "react";
import { buatKoneksiServer } from "./supabase/server.js";
import { toko } from "./toko.js";
import { normalisasiNomorWhatsApp } from "./toko-validation.js";

function ambilNomorFallback() {
  const hasil = normalisasiNomorWhatsApp(toko.nomorWhatsApp);
  if (hasil.valid) return hasil.nomor;
  return String(toko.nomorWhatsApp || "").replace(/\D/g, "");
}

/**
 * Mengambil konfigurasi profil toko dari Supabase (tabel pengaturan_toko id=1)
 * dengan lib/toko.js sebagai fallback bila database belum tersedia/kosong.
 * Di-memoize per request menggunakan React.cache() agar tidak duplikat query.
 */
export const ambilDataToko = cache(async () => {
  const nomorFallback = ambilNomorFallback();

  const fallbackData = {
    nama: toko.nama,
    tagline: toko.tagline,
    nomorWhatsApp: nomorFallback,
    jamBuka: toko.jamBuka,
    alamat: toko.alamat,
    deskripsi: "",
    updatedAt: null,
    sumber: "fallback",
  };

  try {
    const supabase = buatKoneksiServer();
    const { data, error } = await supabase
      .from("pengaturan_toko")
      .select("id, nama_toko, nomor_whatsapp, jam_buka, alamat, deskripsi, updated_at")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return fallbackData;
    }

    const hasilWa = normalisasiNomorWhatsApp(data.nomor_whatsapp);

    return {
      nama:
        typeof data.nama_toko === "string" && data.nama_toko.trim()
          ? data.nama_toko.trim()
          : toko.nama,
      tagline: toko.tagline,
      nomorWhatsApp: hasilWa.valid ? hasilWa.nomor : nomorFallback,
      jamBuka:
        typeof data.jam_buka === "string" && data.jam_buka.trim()
          ? data.jam_buka.trim()
          : toko.jamBuka,
      alamat: typeof data.alamat === "string" ? data.alamat.trim() : "",
      deskripsi:
        typeof data.deskripsi === "string" ? data.deskripsi.trim() : "",
      updatedAt: data.updated_at || null,
      sumber: "database",
    };
  } catch {
    return fallbackData;
  }
});
