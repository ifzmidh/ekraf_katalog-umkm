/**
 * Memvalidasi dan menormalisasi nomor WhatsApp ke format internasional tanpa '+'
 * (contoh: 081234567890 -> 6281234567890, +62 812-3456-7890 -> 6281234567890).
 */
export function normalisasiNomorWhatsApp(input) {
  const raw = String(input ?? "").trim();

  if (!raw) {
    return { valid: false, error: "Nomor WhatsApp wajib diisi." };
  }

  // Tolak URL WhatsApp atau tautan
  if (
    /^https?:\/\//i.test(raw) ||
    /wa\.me/i.test(raw) ||
    /whatsapp\.com/i.test(raw) ||
    /[/?=]/.test(raw)
  ) {
    return {
      valid: false,
      error:
        "Masukkan nomor telepon WhatsApp saja, bukan tautan URL (contoh: 081234567890 atau 6281234567890).",
    };
  }

  // Hanya izinkan digit, spasi, tanda hubung, titik, tanda kurung, dan '+' di awal
  if (!/^\+?[\d\s\-().]+$/.test(raw)) {
    return {
      valid: false,
      error:
        "Nomor WhatsApp hanya boleh berisi angka dan pemisah standar (spasi, -, atau awalan +).",
    };
  }

  // Hapus seluruh karakter non-digit
  let digits = raw.replace(/\D/g, "");

  if (!digits) {
    return { valid: false, error: "Nomor WhatsApp harus berisi angka yang valid." };
  }

  // Tolak duplikasi 0 setelah kode negara 62 (mis. 620812...)
  if (digits.startsWith("620")) {
    return {
      valid: false,
      error:
        "Hapus angka 0 setelah kode negara 62 (contoh: 6281234567890).",
    };
  }

  // Normalisasi awalan lokal Indonesia '0...' -> '62...'
  if (digits.startsWith("0")) {
    digits = `62${digits.slice(1)}`;
  }

  // Pastikan panjang nomor masuk akal (E.164 antara 9 hingga 15 digit)
  if (digits.length < 9 || digits.length > 15) {
    return {
      valid: false,
      error: "Panjang nomor WhatsApp harus antara 9 sampai 15 digit.",
    };
  }

  return { valid: true, nomor: digits };
}

/**
 * Membentuk URL WhatsApp wa.me yang aman dengan encodeURIComponent.
 */
export function buatUrlWhatsApp(nomor, pesan) {
  const digits = String(nomor || "").replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(pesan)}`;
}
