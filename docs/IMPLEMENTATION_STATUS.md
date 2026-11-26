# Status Implementasi Katalog UMKM

Terakhir diperbarui: 26 November 2026

## Status Fitur Tahap 2 (US-18, US-19, US-20)

| User Story | Status | Catatan |
| --- | --- | --- |
| **US-18 Galeri beberapa foto produk** | **BLOCKED** (Menunggu Migration SQL & Uji E2E) | Kode selesai (`GaleriProduk.jsx`, `GambarProduk.jsx`, `FormProduk.jsx`, `actions.js`, `app/produk/[id]/page.jsx`, `app/admin/produk/[id]/ubah/page.jsx`) dan build produksi lulus (`exit code 0`). Memerlukan eksekusi manual `docs/migration-US-18-19-20.sql` di Supabase SQL Editor untuk membuat tabel `produk_foto` beserta RLS sebelum uji end-to-end di browser. |
| **US-19 Status stok** | **BLOCKED** (Menunggu Migration SQL & Uji E2E) | Kode selesai (`ProductCard.jsx`, `app/produk/[id]/page.jsx`, `FormProduk.jsx`, `TabelProduk.jsx`, `actions.js`) dan build produksi lulus (`exit code 0`). Memerlukan eksekusi manual `docs/migration-US-18-19-20.sql` untuk menambah kolom `stok` (`DEFAULT 0`, `CHECK (stok >= 0)`) sebelum uji end-to-end di browser. |
| **US-20 Harga coret dan badge** | **BLOCKED** (Menunggu Migration SQL & Uji E2E) | Kode selesai (`ProductCard.jsx`, `app/produk/[id]/page.jsx`, `PemesanProduk.jsx`, `FormProduk.jsx`, `TabelProduk.jsx`, `actions.js`) dan build produksi lulus (`exit code 0`). Memerlukan eksekusi manual `docs/migration-US-18-19-20.sql` untuk menambah kolom `harga_diskon` dan `is_terlaris` sebelum uji end-to-end di browser. |

## Aturan Bisnis & Dokumentasi Teknis

### 1. Perubahan Database (`docs/migration-US-18-19-20.sql`)
- Tabel `produk`:
  - `stok INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0)`
  - `harga_diskon INTEGER NULL CHECK (harga_diskon IS NULL OR harga_diskon >= 0)`
  - `is_terlaris BOOLEAN NOT NULL DEFAULT FALSE`
- Tabel baru `produk_foto`:
  - `id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY`
  - `produk_id BIGINT NOT NULL REFERENCES public.produk (id) ON DELETE CASCADE`
  - `foto_url TEXT NOT NULL`
  - `urutan INTEGER NOT NULL DEFAULT 0`
  - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
  - RLS diaktifkan (`admin_baca_produk_foto`, `admin_tambah_produk_foto`, `admin_ubah_produk_foto`, `admin_hapus_produk_foto` untuk `authenticated`).

### 2. Aturan Stok (US-19)
- `stok > 0` → Status **Tersedia**, tombol/form pemesanan WhatsApp aktif.
- `stok = 0` → Status **Habis**, produk tetap tampil di katalog dan halaman detail dapat dibuka, namun form pemesanan WhatsApp disembunyikan dan diganti keterangan `"Maaf, produk ini sedang habis dan belum bisa dipesan."`.
- Nilai stok divalidasi di server (`actions.js`) dan database (`CHECK (stok >= 0)`) agar tidak negatif.
- Produk lama mendapat `DEFAULT 0` saat migration dijalankan dan perlu diperbarui stoknya oleh admin.

### 3. Aturan Harga Diskon (US-20)
- `harga_diskon === null` → Tidak ada diskon; hanya harga normal yang tampil.
- `harga_diskon > 0 && harga_diskon < harga` → Diskon aktif; harga normal dicoret (`line-through`), harga diskon tampil sebagai harga utama, dan pesan WhatsApp menggunakan harga diskon.
- `harga_diskon >= harga` atau negatif → Ditolak oleh validasi server (`actions.js`).

### 4. Sumber Data Badge "Baru" dan "Terlaris" (US-20)
- **Badge "Baru"**: Dihitung otomatis dari `created_at` (produk yang dibuat dalam 7 hari terakhir). Tidak disimpan sebagai kolom manual.
- **Badge "Terlaris"**: Menggunakan kolom boolean `is_terlaris` (`DEFAULT FALSE`) yang ditetapkan secara manual oleh admin melalui form produk, karena aplikasi belum memiliki tabel transaksi penjualan.

---

## Status Fitur Tahap 3 (US-21, US-23, US-24, US-36)

| User Story | Status | Catatan |
| --- | --- | --- |
| **US-21 Keranjang, Pesan Semua via WhatsApp** | **BLOCKED** (Menunggu Uji E2E Browser) | Kode selesai (`CartProvider.jsx`, `CartSheet.jsx`, `CartItem.jsx`, `CartButton.jsx`, `AddToCartButton.jsx`, `cart-utils.js`, `/api/produk-by-ids`, integrasi `ProductCard.jsx`, `PemesanProduk.jsx`, `Header.jsx`, `app/layout.jsx`). Unit check utilitas & build produksi lulus (`exit code 0`). Memerlukan uji E2E di browser (serta eksekusi `docs/migration-US-18-19-20.sql` di Supabase untuk kolom `stok` dan `harga_diskon`). |
| **US-23 Bagikan atau Salin Link Produk** | **BLOCKED** (Menunggu Uji E2E Browser) | Kode selesai (`ShareProductButton.jsx` pada `app/produk/[id]/page.jsx`) dengan Web Share API, fallback Clipboard API, toast `"Link tersalin"`, dan input salin manual jika clipboard gagal. Build produksi lulus. Memerlukan uji E2E di browser/perangkat. |
| **US-24 Favorit Tersimpan di Browser** | **BLOCKED** (Menunggu Uji E2E Browser) | Kode selesai (`FavoritesProvider.jsx`, `FavoriteButton.jsx`, `FavoritesHeaderLink.jsx`, `FavoritesView.jsx`, `favorite-utils.js`, halaman `/favorit`, integrasi `ProductCard.jsx` & detail produk). Unit check & build produksi lulus. Memerlukan uji E2E di browser. |
| **US-36 Terakhir Dilihat** | **BLOCKED** (Menunggu Uji E2E Browser) | Kode selesai (`TrackProductView.jsx`, `RecentlyViewed.jsx`, `recently-viewed-utils.js`, integrasi di `app/produk/[id]/page.jsx` & `app/page.jsx`). Unit check & build produksi lulus. Memerlukan uji E2E di browser. |

## Dokumentasi Teknis Tahap 3

### 1. Arsitektur State Management
- **Keranjang (`CartProvider.jsx`)**: React Context + `useReducer`, dibungkus di `app/layout.jsx` sebagai satu sumber state untuk seluruh halaman. Hydration-safe (initial state kosong saat SSR, dimuat di `useEffect`).
- **Favorit (`FavoritesProvider.jsx`)**: React Context + `useState`, dibungkus di `app/layout.jsx`. Menyimpan daftar ID unik produk favorit secara sinkron antarhalaman.
- **Sinkronisasi Server (`/api/produk-by-ids`)**: Route Handler read-only di server yang memakai `buatKoneksiServer()` untuk memvalidasi stok, harga aktif, dan ketersediaan produk tanpa mengekspos kunci Supabase ke browser.

### 2. Penyimpanan `localStorage` & Batas Riwayat
- **Keranjang**: Key `umkm-cart` — menyimpan array item (`productId`, `nama`, `harga`, `harga_diskon`, `stok`, `foto_url`, `quantity`, `unavailable`).
- **Favorit**: Key `umkm-favorites` — menyimpan array ID produk unik (`number[]`).
- **Terakhir Dilihat**: Key `umkm-recently-viewed` — menyimpan array ID produk unik (`number[]`), produk terbaru di indeks 0, **batas maksimal 10 produk**.
- Seluruh pembacaan `localStorage` dibungkus `try/catch` dan fungsi sanitasi untuk menangani data rusak atau tidak valid.

### 3. Alur Pembentukan Pesan WhatsApp (US-21)
1. Saat tombol **Pesan Semua via WhatsApp** diklik di `CartSheet`, client memanggil `/api/produk-by-ids` untuk memvalidasi ulang stok, harga aktif (`harga_diskon` jika valid, atau `harga`), dan keberadaan produk di database.
2. Jika ada produk yang habis (`stok === 0`), dihapus dari database, atau `quantity > stok`, checkout dibatalkan dan pengguna diminta memperbarui keranjang.
3. Jika seluruh item valid, `buildWhatsAppCheckoutUrl` menyusun satu pesan terstruktur berisi nomor urut, nama produk, `quantity x hargaAktif = subtotal`, dan `Total`, lalu mengarahkannya ke `https://wa.me/<nomorWhatsApp>?text=<encoded>` menggunakan `toko.nomorWhatsApp` dari `lib/toko.js`.
