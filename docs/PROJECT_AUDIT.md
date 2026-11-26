# Audit Proyek Katalog UMKM

Tanggal audit: 26 November 2026  
Ruang lingkup: inspeksi statis repository dan validasi build. Tidak ada kode, konfigurasi, skema, atau data yang diubah.

## Ringkasan

Repository sudah memakai Next.js 16 App Router dengan JavaScript, Tailwind CSS 4, Supabase, dan `shadcn/ui` yang telah diinisialisasi. Jalur inti katalog hingga order WhatsApp dan mayoritas CRUD produk tersedia. Akses Supabase dilakukan dari server, tidak ditemukan penggunaan `NEXT_PUBLIC_*`, dan `.env.local` diabaikan oleh Git.

Sebelum migrasi UI ke shadcn, ada dua prioritas: selaraskan token visual lama dengan token shadcn, lalu perketat otorisasi admin. Saat ini RLS dan seluruh Server Action memperlakukan **setiap pengguna Supabase yang terautentikasi** sebagai admin; itu belum membuktikan bahwa hanya pemilik toko yang dapat memodifikasi data.

Validasi produksi: `npm run build` berhasil melewati kompilasi aplikasi sampai proses pengambilan font, lalu gagal karena lingkungan audit tidak dapat mengakses Google Fonts untuk `next/font` Geist. Ini bukan error kode aplikasi yang terbukti, tetapi build produksi perlu diuji lagi pada lingkungan dengan akses font/Vercel.

## Struktur dan routing

| Area | File/rute | Kondisi |
| --- | --- | --- |
| Layout publik | `app/layout.jsx` | Header, konten, Footer global; metadata statis dari `lib/toko.js`. |
| Katalog | `/` → `app/page.jsx` | Query server, filter kategori, pencarian nama. |
| Detail | `/produk/[id]` → `app/produk/[id]/page.jsx` | Validasi ID, detail database, 404, WhatsApp. |
| 404 | `app/not-found.jsx` | Ada dan memiliki tautan kembali. |
| Login admin | `/admin/login` | Form client memanggil Server Action. |
| Admin produk | `/admin` | Daftar, tambah, ubah, hapus. |
| Password | `/admin/password` | Ganti password pengguna yang sedang login. |
| Pengaman rute | `proxy.js` | Matcher `/admin` dan `/admin/:path*`; mengecualikan login. |

Tidak ada `loading.jsx`, route handler, halaman manifest, sitemap, robots, tentang, atau route fitur bonus lain. `lib/data-contoh.js` dan aset SVG contoh masih ada, tetapi tidak diimpor oleh halaman/komponen aktif. `CatatanBelumAktif.jsx` juga tidak dipakai dan dapat dipertahankan hanya sebagai artefak starter atau dihapus pada pekerjaan pembersihan terpisah.

## Dependensi dan konfigurasi

- `next` 16.4.6, React/React DOM 19.3.0, JavaScript/JSX dengan alias `@/*`.
- Tailwind 4.3.3 memakai plugin PostCSS resmi; tidak ada `tailwind.config.js`, yang sesuai untuk pendekatan CSS-first Tailwind v4.
- Supabase: `@supabase/supabase-js` 2.117.2 dan `@supabase/ssr` 0.12.7.
- shadcn sudah dikonfigurasi melalui `components.json`: style `base-nova`, RSC aktif, JavaScript (`tsx: false`), Base UI dan Lucide. Ada 26 komponen `components/ui/*`, tetapi belum diimpor aplikasi bisnis.
- `next.config.mjs` menetapkan batas Server Action 3 MB; sesuai dengan batas upload aplikasi 2 MB. Opsi `typescript.ignoreBuildErrors` tidak relevan bagi source JavaScript, tetapi sebaiknya tidak dijadikan pengganti pemeriksaan build bila TypeScript kelak ditambahkan.
- Tidak ada konfigurasi `images.remotePatterns`; aman selama memakai `<img>`, tetapi wajib ditambah bila migrasi ke `next/image` untuk URL Storage/eksternal dilakukan.

## Sistem desain dan kesiapan shadcn/ui

Sistem lama mengikuti `DESIGN.md`: token Tailwind seperti `bg-utama`, `text-teks`, dan `bg-permukaan`, dengan brand hijau dan font Plus Jakarta Sans. Sistem shadcn memakai token CSS semantik `background`, `foreground`, `primary`, `card`, dan seterusnya pada palet netral.

`app/globals.css` saat ini memuat keduanya. `app/layout.jsx` juga memasang Geist lewat `next/font/google` sekaligus memuat Plus Jakarta Sans dari stylesheet Google. Nilai `--font-sans` dipakai ulang oleh kedua sistem, sehingga font efektif bergantung urutan CSS/injeksi font dan tidak konsisten dengan satu-satunya font yang ditetapkan `DESIGN.md`.

Konflik yang harus ditangani saat migrasi:

1. Komponen lama akan tetap hijau-brand, sementara Button/Card shadcn default akan netral/hitam karena `--primary` belum dipetakan ke token brand.
2. Aturan `html` dan `:focus-visible` yang berada di luar `@layer base` dapat mengalahkan utility/focus ring shadcn menurut urutan cascade Tailwind v4.
3. Template adalah **Base UI**, bukan template Radix. Contoh shadcn Radix yang memakai `asChild` tidak boleh disalin mentah; komponen yang ada memakai prop `render`.
4. `components/ui/sonner.jsx` memanggil `useTheme`; memasang `<Toaster />` tanpa ThemeProvider `next-themes` akan bermasalah. Mode gelap belum diaktifkan secara fungsional.

Rekomendasi: pertahankan warna domain lama sebagai sumber brand, petakan ke token semantik shadcn dalam satu perubahan CSS terencana, pilih satu cara pemuatan font (idealnya `next/font` untuk Plus Jakarta Sans), lalu migrasikan komponen bertahap. Jangan mengganti Server Action, query, nama kolom, atau klien Supabase selama migrasi visual.

## Halaman, komponen, dan data

| Komponen/file | Status | Rekomendasi |
| --- | --- | --- |
| `Header`, `Footer`, `KartuProduk`, `TombolWhatsApp` | Berfungsi dan tidak mengakses backend | Pertahankan kontrak/logic; modernisasi markup bertahap. Tambahkan fallback gambar. |
| `Input`, `Tombol` | Reusable custom dan dipakai luas | Dapat menjadi adapter menuju `ui/input`, `ui/textarea`, `ui/label`, `ui/button`; jangan langsung mengubah API semua form sekaligus. |
| `FormProduk` | Tambah/ubah dan upload file berjalan | Perbaiki error per-field dan pemulihan nilai form. |
| `TabelProduk` | Konfirmasi hapus custom, refresh setelah action | Kandidat kuat untuk `ui/table` dan `ui/alert-dialog`; dialog sekarang belum menangani focus trap/escape secara eksplisit. |
| `NavAdmin` | Navigasi dan logout Server Action | Dapat dipertahankan; perlu status tautan aktif bila UI ditingkatkan. |
| `components/ui/*` | Terpasang, belum dipakai | Pakai hanya komponen yang dibutuhkan; jangan migrasi semua sekaligus. |
| `lib/data-contoh.js` | Data dummy tidak aktif | Tidak ada komponen aktif yang masih memakai dummy. |

`foto_url` boleh `null` di skema dan form tidak mewajibkan foto. Namun tiga tempat (`KartuProduk`, detail produk, `TabelProduk`) tetap merender `<img src={null}>`, sehingga produk tanpa foto menghasilkan gambar rusak. URL foto manual yang disebut PRD juga tidak lagi tersedia sebagai input; form hanya menerima upload file.

## Supabase, sesi, dan Server Actions

`lib/supabase/server.js` menyediakan dua klien yang benar-benar berada di sisi server:

- `buatKoneksiServer()` memakai `SUPABASE_SECRET_KEY`, tanpa sesi persisten, untuk baca katalog publik dan upload Storage.
- `buatKoneksiSesi()` memakai `SUPABASE_PUBLISHABLE_KEY` dan cookie request melalui `@supabase/ssr`, untuk Auth dan mutasi data yang tunduk pada RLS.

`app/admin/actions.js` mencakup login, logout, ganti password, tambah, ubah, hapus, validasi ukuran/tipe foto, revalidasi cache, dan redirect. Semua mutasi produk serta ganti password memanggil `auth.getUser()` pada server sebelum berjalan. `proxy.js` juga melakukan `getUser()` dan fail-closed menuju login bila konfigurasi Supabase tidak tersedia.

Environment yang dideklarasikan tepat: `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, dan `SUPABASE_SECRET_KEY`. `.env.example` mendokumentasikan ketiganya; `.env.local` dilindungi `.gitignore`. Nilai rahasia tidak dimasukkan dalam laporan ini dan tidak ditemukan hard-code credential pada source yang diperiksa.

## Status user story

Status berikut adalah hasil inspeksi source; fitur yang memerlukan proyek Supabase/bucket nyata tetap perlu diuji end-to-end.

| Status | User story |
| --- | --- |
| Selesai dari source | US-01, US-02, US-03, US-04, US-05, US-06, US-07, US-08, US-09, US-10, US-11 |
| Selesai bersyarat | US-29 — source memenuhi form, validasi, upload server, dan penyimpanan URL; bucket `products` harus ada dan mengizinkan URL publik agar foto tampil. |
| Sebagian | US-28 — 404 ada, loading/skeleton belum. US-34 — validasi server nama/harga ada, tetapi error belum per field dan input tidak dipertahankan; juga harga `0` diizinkan walaupun kriteria menyebut positif. |
| Belum ada | US-12–US-27, US-30–US-33, US-35–US-50. |

Catatan spesifik: US-13 memiliki aset ikon, tetapi manifest dan tautannya belum ada. US-25 memiliki dependensi `next-themes` serta token `.dark`, tetapi belum memiliki provider/toggle/persistensi. US-26 belum mempunyai `generateMetadata` detail. US-14 dan US-50 belum boleh dimulai tanpa keputusan penyedia AI, key server-only, batas biaya, serta penambahan data/route yang sesuai.

## Temuan risiko dan prioritas

### Tinggi

1. **Tidak ada pemisahan peran admin di RLS.** `docs/schema.sql` memberi select/insert/update/delete kepada `to authenticated using (true)`. `periksaSesiAdmin()` hanya memastikan ada user, bukan role/admin claim. Siapa pun yang memperoleh akun Auth valid dapat memanggil action mutasi atau mengakses data yang RLS izinkan. Pendaftaran publik mungkin dimatikan di dashboard, tetapi itu bukan kontrol otorisasi aplikasi yang terverifikasi di repository.
2. **Server Component admin membaca memakai secret key.** `/admin` dan halaman ubah memakai `buatKoneksiServer()` yang melewati RLS dan bergantung pada proxy saja. Pertahankan proxy, tetapi tambahkan verifikasi sesi pada render admin dan gunakan session client untuk data admin pada tahap hardening.

### Sedang

1. **SVG diizinkan untuk upload.** SVG dapat menjadi konten aktif ketika diakses sebagai dokumen publik. Jika SVG tidak merupakan kebutuhan bisnis, keluarkan dari allowlist; jika perlu, sanitasi/konversi di server dan atur header Storage.
2. **File Storage yatim.** Mengganti atau menghapus produk tidak menghapus foto sebelumnya. Ini menambah biaya/objek tak terpakai dan perlu strategi nama/path serta cleanup yang aman.
3. **Pemeriksaan kegagalan data detail kurang ramah.** Error database detail dicatat lalu berubah menjadi 404 karena `produk` kosong; gangguan database semestinya membedakan 500/feedback retry dari produk benar-benar tidak ada.
4. **Tidak ada fallback foto**, sebagaimana dijelaskan di atas.

### Rendah / kualitas

1. Login tidak mengarahkan pengguna yang sudah masuk dari `/admin/login` ke `/admin`.
2. Belum ada loading state, metadata produk, manifest, robots, sitemap, atau test otomatis.
3. Skema SQL menambahkan 54 data demonstrasi untuk paginasi. Itu berguna workshop, namun jangan dijalankan mentah pada katalog produksi klien.

## Berkas yang perlu dibuat atau diubah pada tahap berikutnya

Tidak ada perubahan dilakukan oleh audit ini. Untuk pekerjaan yang direkomendasikan:

| Tahap | Buat | Ubah |
| --- | --- | --- |
| Hardening otorisasi | Mekanisme role/claim atau tabel policy yang disetujui, serta helper session admin | `docs/schema.sql` dan `lib/supabase/server.js` hanya setelah persetujuan eksplisit; `proxy.js`, halaman admin, `app/admin/actions.js` |
| Fondasi shadcn | Opsional `components/ThemeProvider.jsx` | `app/globals.css`, `app/layout.jsx` |
| Migrasi UI aman | Opsional adapter gambar/fallback | `Tombol`, `Input`, `KartuProduk`, `FormProduk`, `TabelProduk`, form login/password, `NavAdmin` |
| UX saat memuat | `app/loading.jsx`, `app/produk/[id]/loading.jsx` | Tidak wajib mengubah backend |
| PWA/SEO (jika dipilih) | `app/manifest.js`, `app/robots.js`, `app/sitemap.js` | `app/layout.jsx`, detail produk |

Perubahan schema tidak termasuk pekerjaan UI dan tidak boleh dilakukan tanpa instruksi terpisah, karena batasan proyek melarang perubahan struktur database/RLS tanpa permintaan.

## Urutan pengerjaan yang disarankan

1. Putuskan dan harden model otorisasi admin sebelum menambah fitur mutasi baru.
2. Bereskan satu font dan pemetaan token warna shadcn tanpa mengubah backend.
3. Migrasikan komponen fondasi (Button/Input/Card), lalu tabel/dialog dan form admin; lakukan regresi login, CRUD, upload, dan WhatsApp setelah setiap batch kecil.
4. Selesaikan fallback foto, error per field, preservation form, serta skeleton (US-28/US-34).
5. Baru pilih satu user story bonus per iterasi, dengan perubahan schema hanya bila disetujui.

## Checklist regresi setelah migrasi UI

- Katalog, filter `kategori`, dan query `q` masih berasal dari server dan menangani kosong/error.
- Detail dengan ID valid/tidak valid, format rupiah, dan tautan WhatsApp dengan pesan ter-encode tetap benar.
- Login gagal/berhasil, logout, proteksi `/admin/*`, dan ganti password bekerja.
- Tambah, ubah, hapus produk serta upload JPG/PNG/WebP/GIF dalam 2 MB bekerja; file salah/terlalu besar ditolak.
- Tidak ada secret atau klien Supabase di komponen bertanda `"use client"`.
