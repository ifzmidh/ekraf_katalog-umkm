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
