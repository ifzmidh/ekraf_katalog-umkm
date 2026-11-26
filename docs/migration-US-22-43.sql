-- Migration US-22 & US-43
-- Katalog UMKM – Profil & Pengaturan Toko
--
-- Cara menjalankan:
--   Supabase > SQL Editor > New query > tempel seluruh isi file ini > Run.
--   Aman dijalankan ulang (idempotent).

-- ============================================================
-- 1. Tabel pengaturan_toko (singleton row id = 1)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pengaturan_toko (
  id             INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  nama_toko      TEXT NOT NULL,
  nomor_whatsapp TEXT NOT NULL,
  jam_buka       TEXT NOT NULL,
  alamat         TEXT NOT NULL,
  deskripsi      TEXT,
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- 2. Row Level Security (RLS)
--    Hanya admin yang sudah login (authenticated) dapat membaca & mengubah
--    melalui sesi Supabase Auth. Pengunjung publik membaca melalui Server Component.
-- ============================================================
ALTER TABLE public.pengaturan_toko ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_baca_pengaturan_toko"   ON public.pengaturan_toko;
DROP POLICY IF EXISTS "admin_tambah_pengaturan_toko" ON public.pengaturan_toko;
DROP POLICY IF EXISTS "admin_ubah_pengaturan_toko"   ON public.pengaturan_toko;

CREATE POLICY "admin_baca_pengaturan_toko" ON public.pengaturan_toko
  FOR SELECT TO authenticated USING (id = 1);

CREATE POLICY "admin_tambah_pengaturan_toko" ON public.pengaturan_toko
  FOR INSERT TO authenticated WITH CHECK (id = 1);

CREATE POLICY "admin_ubah_pengaturan_toko" ON public.pengaturan_toko
  FOR UPDATE TO authenticated USING (id = 1) WITH CHECK (id = 1);

-- ============================================================
-- 3. Data awal (hanya diisi jika baris singleton belum ada)
--    Menggunakan konfigurasi awal yang selaras dengan lib/toko.js.
-- ============================================================
INSERT INTO public.pengaturan_toko (
  id,
  nama_toko,
  nomor_whatsapp,
  jam_buka,
  alamat,
  deskripsi
)
VALUES (
  1,
  'Raja Roster',
  '6285172074546',
  'Setiap hari, 08.00–20.00',
  'Jl. Pembangunan, Desa Teladan, Kec. Curup Selatan, Prov. Bengkulu',
  'Produk roster beton modern minimalis, ornamen dinding, dan batu alam berkualitas'
)
ON CONFLICT (id) DO NOTHING;
