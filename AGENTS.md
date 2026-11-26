# Aturan untuk AI Agent

Baca file ini sebelum mengerjakan apa pun. Aturan di sini berlaku untuk setiap prompt.

## Tentang proyek

Aplikasi katalog produk UMKM. Pengunjung melihat katalog dan detail produk, lalu memesan lewat WhatsApp. Pemilik toko masuk ke halaman admin untuk mengganti password dan mengelola produk.

Sebelum mengerjakan fitur, baca:

- `docs/PRD.md` untuk tujuan dan ruang lingkup
- `docs/user-stories.md` untuk kriteria selesai setiap fitur (US-01, US-02, dan seterusnya)
- `docs/rancangan-teknis.md` untuk alur data dan struktur folder
- `DESIGN.md` untuk aturan tampilan

## Stack (jangan diganti)

- Next.js 16 dengan App Router, JavaScript (bukan TypeScript)
- Tailwind CSS 4, token warna ada di `app/globals.css`
- Supabase (`@supabase/supabase-js` dan `@supabase/ssr` sudah terpasang)
- Hosting di Vercel

## Aturan keamanan (wajib)

1. Supabase hanya boleh diakses dari server: Server Component, Server Action, atau Route Handler. Jangan membuat client Supabase di file yang memakai `"use client"`.
2. Environment variable tidak boleh memakai awalan `NEXT_PUBLIC_`. Nama variabel: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY` (lihat `.env.example`).
3. Setiap aksi yang mengubah data (ganti password, tambah, ubah, hapus produk) wajib memeriksa di server bahwa admin sudah login sebelum dijalankan.
4. Semua halaman di bawah `/admin` (kecuali `/admin/login`) hanya boleh dibuka admin yang sudah login.
5. Jangan menulis kunci, password, atau email admin di dalam kode.
6. Jangan mematikan Row Level Security (RLS) dan jangan mengubah aturan di `docs/schema.sql` tanpa diminta.

## Catatan Next.js 16

- `params` pada halaman dinamis berupa Promise: gunakan `const { id } = await params`.
- File untuk memproteksi rute bernama `proxy.js` di root proyek (pengganti `middleware.js`).
- Gunakan Server Action untuk memproses form.

## Data

Tabel `produk` dengan kolom: `id`, `nama`, `harga`, `deskripsi`, `foto_url`, `kategori`, `created_at`. Jangan mengganti nama kolom. Data contoh di `lib/data-contoh.js` memakai nama kolom yang sama dan tidak dipakai lagi setelah halaman terhubung ke database.

Identitas toko (nama, nomor WhatsApp, alamat, jam buka) ada di `lib/toko.js`.

## Cara bekerja

1. Kerjakan satu fitur atau satu user story per prompt.
2. Ubah hanya file yang disebut atau yang memang dibutuhkan fitur itu.
3. Pakai komponen yang sudah ada di `components/` sebelum membuat yang baru.
4. Jangan memasang paket npm baru tanpa diminta.
5. Jangan menjalankan perintah Git apa pun (commit, push, dan lainnya dilakukan manual oleh pengguna).
6. Hapus komponen `CatatanBelumAktif` dari halaman yang fiturnya sudah selesai.
7. Setelah selesai, jelaskan singkat: file apa saja yang diubah dan cara mengetesnya.

## Hasil [Integrasi Supabase untuk Daftar Produk]

Analyzed AGENTS.md:L1-52
Analyzed user-stories.md:L1-614
Analyzed page.jsx:L1-36
Analyzed package.json:L1-24
Ran list project files
Analyzed rancangan-teknis.md:L1-68
Analyzed schema.sql:L1-90
Analyzed DESIGN.md:L1-51
Analyzed globals.css:L1-33
Analyzed KartuProduk.jsx:L1-24
Analyzed data-contoh.js:L1-59
Analyzed .env.example:L1-13
Analyzed next.config.mjs:L1-7
Analyzed PRD.md:L1-59
Analyzed skema-database.md:L1-26
Analyzed checklist-keamanan.md:L1-13
Analyzed jsconfig.json:L1-8
Analyzed layout.jsx:L1-29
Analyzed CatatanBelumAktif.jsx:L1-9
Analyzed checklist-pengujian.md:L1-26
Analyzed page.jsx:L1-28
Analyzed page.jsx:L1-40
Analyzed not-found.jsx:L1-11
Analyzed Input.jsx:L1-15
Ran check env variables status
Created server.js
Edited page.jsx
Ran build Next.js application
Ran check for NEXT_PUBLIC usage

Perubahan untuk **US-01 (Katalog dari database)** sudah selesai:

### File yang dibuat dan diubah

- [server.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/supabase/server.js) _(baru)_ — Membuat fungsi `buatKoneksiServer()` menggunakan `createClient` dari `@supabase/supabase-js` dengan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` dari environment variable (khusus sisi server, tanpa `NEXT_PUBLIC_`).
- [page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/page.jsx) _(diubah)_:
  - Mengubah `HalamanKatalog` menjadi `async` Server Component dengan `export const dynamic = "force-dynamic"` agar selalu mengambil data terbaru di sisi server.
  - Mengambil daftar produk (`id`, `nama`, `harga`, `foto_url`, `kategori`) dari tabel `produk` di Supabase, diurutkan dari `created_at` terbaru.
  - Tetap memakai komponen [KartuProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/KartuProduk.jsx) tanpa mengubah tampilannya.
  - Menampilkan pesan error yang jelas jika koneksi atau query ke database gagal.
  - Menampilkan tulisan `"Belum ada produk"` jika tabel `produk` kosong.
  - Menghapus `CatatanBelumAktif` dan ketergantungan pada [data-contoh.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/data-contoh.js) dari halaman ini.

### Verifikasi yang sudah dijalankan

- `npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error, dan rute `/` terdeteksi sebagai dynamic server-rendered (`ƒ /`).
- Pengecekan kode memastikan tidak ada environment variable berawalan `NEXT_PUBLIC_`.

### Cara mengetesnya

1. Pastikan tabel `produk` di Supabase sudah dibuat dan terisi data dari [schema.sql](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/docs/schema.sql), serta `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` di `.env.local` terisi benar.
2. Jalankan server lokal di folder proyek:
   ```bash
   npm run dev
   ```
3. Buka `http://localhost:3000` di browser:
   - Pastikan seluruh produk dari tabel `produk` muncul dengan foto, kategori, nama, dan harga rupiah.
   - Buka DevTools > tab **Network**, muat ulang halaman, dan pastikan tidak ada permintaan langsung dari browser ke `supabase.co`.
   - Untuk menguji kondisi kosong, kosongkan sementara tabel `produk` (atau uji pada database kosong) dan pastikan tampil tulisan `"Belum ada produk"`.
   - Untuk menguji kondisi error, ubah sementara nilai `SUPABASE_SECRET_KEY` menjadi tidak valid lalu muat ulang halaman untuk memastikan pesan error tampil dengan jelas.
