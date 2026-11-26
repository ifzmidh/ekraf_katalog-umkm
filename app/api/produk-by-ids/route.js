import { NextResponse } from "next/server";
import { buatKoneksiServer } from "@/lib/supabase/server";

const MAX_IDS = 50;

/**
 * Route Handler read-only untuk mengambil data produk terbaru berdasarkan daftar ID.
 * Digunakan oleh fitur keranjang (validasi stok & harga), favorit, dan terakhir dilihat
 * tanpa mengekspos kunci Supabase ke browser.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const rawIds = searchParams.get("ids") || "";

  const uniqueIds = Array.from(
    new Set(
      rawIds
        .split(",")
        .map((part) => part.trim())
        .filter((part) => /^\d+$/.test(part))
        .map((part) => Number(part))
        .filter((num) => Number.isSafeInteger(num) && num > 0)
    )
  ).slice(0, MAX_IDS);

  if (uniqueIds.length === 0) {
    return NextResponse.json({ produk: [] });
  }

  try {
    const supabase = buatKoneksiServer();
    const { data, error } = await supabase
      .from("produk")
      .select(
        "id, nama, harga, harga_diskon, stok, foto_url, kategori, is_terlaris, created_at"
      )
      .in("id", uniqueIds);

    if (error) {
      console.error("Gagal mengambil produk by IDs:", error.message);
      return NextResponse.json(
        { error: "Gagal mengambil data produk dari server." },
        { status: 500 }
      );
    }

    return NextResponse.json({ produk: data ?? [] });
  } catch (err) {
    console.error("Kesalahan server saat mengambil produk by IDs:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan koneksi ke database." },
      { status: 500 }
    );
  }
}
