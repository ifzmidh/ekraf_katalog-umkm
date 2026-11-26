-- Migration US-18, US-19, US-20
-- Katalog UMKM – Galeri Foto, Status Stok, Harga Coret & Badge
--
-- Cara menjalankan:
--   Supabase > SQL Editor > New query > tempel seluruh isi file ini > Run.
--   Aman dijalankan ulang (semua operasi pakai IF NOT EXISTS / ALTER COLUMN ... DEFAULT).
--
-- Tidak ada data lama yang dihapus. Kolom baru punya DEFAULT sehingga baris lama tetap valid.

-- ============================================================
-- US-19 – Tambah kolom stok ke tabel produk
-- ============================================================
ALTER TABLE public.produk
  ADD COLUMN IF NOT EXISTS stok INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0);

-- ============================================================
-- US-20 – Tambah kolom harga_diskon dan is_terlaris ke tabel produk
-- ============================================================
ALTER TABLE public.produk
  ADD COLUMN IF NOT EXISTS harga_diskon INTEGER NULL CHECK (harga_diskon IS NULL OR harga_diskon >= 0),
  ADD COLUMN IF NOT EXISTS is_terlaris  BOOLEAN NOT NULL DEFAULT FALSE;

-- ============================================================
-- US-18 – Tabel produk_foto untuk galeri beberapa foto per produk
-- ============================================================
CREATE TABLE IF NOT EXISTS public.produk_foto (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  produk_id  BIGINT NOT NULL REFERENCES public.produk (id) ON DELETE CASCADE,
  foto_url   TEXT NOT NULL,
  urutan     INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index untuk mempercepat query JOIN galeri
CREATE INDEX IF NOT EXISTS idx_produk_foto_produk_id
  ON public.produk_foto (produk_id, urutan);

-- ============================================================
-- RLS tabel produk_foto
-- ============================================================
ALTER TABLE public.produk_foto ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_baca_produk_foto"  ON public.produk_foto;
DROP POLICY IF EXISTS "admin_tambah_produk_foto" ON public.produk_foto;
DROP POLICY IF EXISTS "admin_ubah_produk_foto"   ON public.produk_foto;
DROP POLICY IF EXISTS "admin_hapus_produk_foto"  ON public.produk_foto;

CREATE POLICY "admin_baca_produk_foto" ON public.produk_foto
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "admin_tambah_produk_foto" ON public.produk_foto
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "admin_ubah_produk_foto" ON public.produk_foto
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_hapus_produk_foto" ON public.produk_foto
  FOR DELETE TO authenticated USING (true);

-- ============================================================
-- Catatan untuk pembaca:
--
-- US-18 (Galeri):
--   - Tabel produk_foto menyimpan foto tambahan.
--   - Kolom foto_url di tabel produk TETAP dipertahankan sebagai foto utama
--     (kompatibilitas data lama). Galeri membaca produk_foto JOIN produk.foto_url.
--
-- US-19 (Stok):
--   - Kolom stok DEFAULT 0 artinya semua produk lama dimulai sebagai "Habis".
--     Admin perlu memperbarui stok setiap produk melalui form ubah produk.
--   - Validasi stok >= 0 diterapkan di level database (CHECK constraint).
--
-- US-20 (Harga & Badge):
--   - harga_diskon NULL  → tidak ada diskon.
--   - harga_diskon > 0 AND < harga → diskon aktif. Validasi dilakukan di server action.
--   - harga_diskon >= harga → ditolak oleh validasi server (bukan constraint DB,
--     karena harga bisa berubah independen).
--   - Badge "Baru" dihitung dari created_at (produk dibuat <= 7 hari lalu).
--     TIDAK disimpan sebagai kolom, dihitung di server.
--   - Badge "Terlaris" dikelola manual admin melalui kolom is_terlaris.
--     Karena tidak ada tabel transaksi, ini adalah penetapan manual yang dokumentasikan.
-- ============================================================
