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

## Hasil (US-1) [Integrasi Supabase untuk Daftar Produk]

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

## Hasil (US-2) [Supabase Product Detail SSR]

Analyzed user-stories.md:L1-614
Analyzed page.jsx:L1-40
Analyzed server.js:L1-21
Analyzed page.jsx:L1-64
Analyzed AGENTS.md:L1-117
Analyzed schema.sql:L1-90
Analyzing not-found.jsx
Edited page.jsx
Ran build Next.js application

Perubahan untuk **US-02 (Detail produk)** sudah selesai.

### File yang diubah

- [page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/produk/[id]/page.jsx):
  - Mengambil satu produk dari tabel `produk` di Supabase (`id, nama, harga, deskripsi, foto_url, kategori`) berdasarkan `id` dari `await params` di sisi server menggunakan `buatKoneksiServer()` dari [server.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/supabase/server.js).
  - Menambahkan `export const dynamic = "force-dynamic"` agar halaman selalu dirender di server per permintaan.
  - Memanggil `notFound()` jika format `id` bukan angka bulat positif atau jika produk tidak ditemukan di database.
  - Menghapus komponen `CatatanBelumAktif` dan ketergantungan pada `cariProdukContoh`, sambil mempertahankan tampilan halaman dan komponen `TombolWhatsApp`.

### Verifikasi

- `npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error, dan rute `/produk/[id]` tercatat sebagai dynamic server-rendered (`ƒ /produk/[id]`).

### Cara mengetesnya

1. Jalankan server pengembangan di folder proyek:
   ```bash
   npm run dev
   ```
2. Buka beranda `http://localhost:3000`, lalu klik salah satu produk untuk membuka `/produk/[id]`. Pastikan foto, kategori, nama, harga rupiah, deskripsi, dan tombol WhatsApp tampil sesuai data dari Supabase, tanpa kotak `CatatanBelumAktif`.
3. Buka URL dengan ID yang tidak ada (misalnya `http://localhost:3000/produk/999999` atau `http://localhost:3000/produk/abc`) dan pastikan tampil halaman "tidak ditemukan" (`404`).

## Hasil (US-3) [Supabase Product Detail SSR]

Analyzed toko.js:L1-10
Analyzed TombolWhatsApp.jsx:L1-12
Ran search for CatatanBelumAktif and WhatsApp spec
Analyzed rancangan-teknis.md:L1-68
Analyzed format.js:L1-7
Analyzed page.jsx:L1-52
Analyzed jsconfig.json:L1-7
Ran search for US-03 references
Edited TombolWhatsApp.jsx
Ran build Next.js app

Perubahan untuk **US-03** telah selesai diterapkan:

- **[TombolWhatsApp.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/TombolWhatsApp.jsx)**:
  - Mengubah `<button>` menjadi tautan `<a>` dengan `target="_blank"` dan `rel="noopener noreferrer"` agar terbuka di tab baru, sambil mempertahankan kelas styling tombol yang sama.
  - Menggunakan `toko.nomorWhatsApp` dari [toko.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/toko.js) dan `formatRupiah` dari [format.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/format.js) untuk membentuk URL `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}` yang memuat nama dan harga produk dalam format rupiah.
- **[page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/produk/[id]/page.jsx)**: Komponen `CatatanBelumAktif` sudah tidak ada di halaman detail produk, sehingga tidak ada yang perlu dihapus di sana.

**Verifikasi:**

- `npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`).

## Hasil (US-3) [Supabase Product Detail SSR]

Analyzed toko.js:L1-10
Analyzed TombolWhatsApp.jsx:L1-12
Ran search for CatatanBelumAktif and WhatsApp spec
Analyzed rancangan-teknis.md:L1-68
Analyzed format.js:L1-7
Analyzed page.jsx:L1-52
Analyzed jsconfig.json:L1-7
Ran search for US-03 references
Edited TombolWhatsApp.jsx
Ran build Next.js app

Perubahan untuk **US-03** telah selesai diterapkan:

- **[TombolWhatsApp.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/TombolWhatsApp.jsx)**:
  - Mengubah `<button>` menjadi tautan `<a>` dengan `target="_blank"` dan `rel="noopener noreferrer"` agar terbuka di tab baru, sambil mempertahankan kelas styling tombol yang sama.
  - Menggunakan `toko.nomorWhatsApp` dari [toko.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/toko.js) dan `formatRupiah` dari [format.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/format.js) untuk membentuk URL `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}` yang memuat nama dan harga produk dalam format rupiah.
- **[page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/produk/[id]/page.jsx)**: Komponen `CatatanBelumAktif` sudah tidak ada di halaman detail produk, sehingga tidak ada yang perlu dihapus di sana.

**Verifikasi:**

- `npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`).

## Hasil (US-4) [Supabase Admin Login Implementation]

Analyzed AGENTS.md:L1-198
Analyzed user-stories.md:L1-614
Analyzed server.js:L1-21
Analyzed page.jsx:L1-28
Analyzed NavAdmin.jsx:L1-18
Analyzed package.json:L1-24
Analyzed rancangan-teknis.md:L1-68
Analyzed globals.css:L1-33
Analyzed Input.jsx:L1-15
Analyzed Tombol.jsx:L1-25
Analyzed .env.example:L1-13
Ran list admin and lib files
Edited server.js
Created actions.js
Created FormLogin.jsx
Edited page.jsx
Edited NavAdmin.jsx
Ran build Next.js app and check env vars

Implementasi **US-04 (Login admin)** dengan Supabase Auth (`@supabase/ssr` dan cookie) di sisi server telah selesai.

### File yang dibuat dan diubah

- [server.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/supabase/server.js): Menambahkan `buatKoneksiSesi()` menggunakan `createServerClient` dari `@supabase/ssr` dengan `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, dan `cookies()` dari `next/headers`.
- [actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js) _(baru)_: Menambahkan Server Action `masukAdmin` (autentikasi `signInWithPassword`, mengembalikan pesan error yang jelas jika gagal, dan `redirect("/admin")` jika berhasil) serta `keluarAdmin` (`signOut()` lalu `redirect("/admin/login")`).
- [FormLogin.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/login/FormLogin.jsx) _(baru)_: Komponen form login dengan `useActionState(masukAdmin, null)` untuk menampilkan pesan error di halaman login tanpa mengakses Supabase dari client.
- [page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/login/page.jsx): Menyambungkan halaman login ke `FormLogin` dan menghapus `CatatanBelumAktif` tanpa mengubah tampilan.
- [NavAdmin.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/NavAdmin.jsx): Menyambungkan tombol **Keluar** ke Server Action `keluarAdmin` melalui `<form action={keluarAdmin}>`.

### Verifikasi

- `npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`).
- Pengecekan kode memastikan tidak ada penggunaan `NEXT_PUBLIC_` di `app/`, `components/`, maupun `lib/`.

### Cara mengetesnya

1. Pastikan `SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY` di `.env.local` sudah terisi dan akun admin sudah dibuat di Supabase Auth.
2. Jalankan server lokal di folder `ekraf_katalog-umkm`:
   ```bash
   npm run dev
   ```
3. Buka `http://localhost:3000/admin/login`:
   - Coba masuk dengan email atau password yang salah, lalu pastikan muncul pesan error `"Email atau password salah."` di atas form.
   - Masuk dengan email dan password admin yang benar, lalu pastikan halaman diarahkan ke `/admin` dan cookie sesi tersimpan.
   - Klik tombol **Keluar** di navigasi admin, lalu pastikan sesi berakhir dan halaman kembali ke `/admin/login`.

## Hasil (US-5) [Supabase Admin Login Implementation]
