// US-14: Server route – memanggil Gemini API untuk membuat deskripsi produk.
// API key HANYA disimpan di server (tanpa NEXT_PUBLIC_).
// Endpoint: POST /api/ai-deskripsi
// Body: { nama: string, kategori: string }
// Response: { deskripsi: string }

import { NextResponse } from "next/server";

const BATAS_KARAKTER = 500;
const TIMEOUT_MS = 15_000;

export async function POST(request) {
  // --- Baca & validasi body ---
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body JSON tidak valid." },
      { status: 400 }
    );
  }

  const nama = (body?.nama ?? "").toString().trim();
  const kategori = (body?.kategori ?? "").toString().trim();

  if (!nama || nama.length < 2) {
    return NextResponse.json(
      { error: "Nama produk wajib diisi (minimal 2 karakter)." },
      { status: 400 }
    );
  }
  if (nama.length > 100) {
    return NextResponse.json(
      { error: "Nama produk terlalu panjang (maks. 100 karakter)." },
      { status: 400 }
    );
  }
  if (kategori.length > 100) {
    return NextResponse.json(
      { error: "Kategori terlalu panjang (maks. 100 karakter)." },
      { status: 400 }
    );
  }

  // --- Pastikan API key tersedia ---
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY belum dikonfigurasi di environment.");
    return NextResponse.json(
      { error: "Layanan AI belum dikonfigurasi. Hubungi administrator." },
      { status: 503 }
    );
  }

  // --- Susun prompt ---
  const kategoriTeks = kategori ? ` dalam kategori "${kategori}"` : "";
  const prompt =
    `Buatkan deskripsi produk singkat dan menarik dalam Bahasa Indonesia ` +
    `untuk produk bernama "${nama}"${kategoriTeks}. ` +
    `Deskripsi harus informatif, profesional, dan tidak lebih dari ${BATAS_KARAKTER} karakter. ` +
    `Langsung tulis deskripsinya tanpa judul, label, atau penjelasan tambahan.`;

  // --- Panggil Gemini API dengan timeout ---
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let hasilAI;
  try {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent` +
      `?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 256,
          stopSequences: [],
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Gemini API error:", res.status, errBody);
      return NextResponse.json(
        { error: `Layanan AI mengembalikan error (${res.status}). Coba lagi nanti.` },
        { status: 502 }
      );
    }

    const data = await res.json();
    hasilAI = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (err) {
    if (err.name === "AbortError") {
      return NextResponse.json(
        { error: "Permintaan ke layanan AI habis waktu. Coba lagi." },
        { status: 504 }
      );
    }
    console.error("Gagal menghubungi Gemini API:", err);
    return NextResponse.json(
      { error: "Gagal menghubungi layanan AI. Periksa koneksi server." },
      { status: 502 }
    );
  } finally {
    clearTimeout(timer);
  }

  // --- Batasi panjang hasil ---
  const deskripsi = hasilAI.trim().slice(0, BATAS_KARAKTER);

  if (!deskripsi) {
    return NextResponse.json(
      { error: "AI tidak menghasilkan deskripsi. Coba lagi." },
      { status: 500 }
    );
  }

  return NextResponse.json({ deskripsi });
}
