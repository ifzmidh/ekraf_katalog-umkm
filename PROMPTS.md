# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

---

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
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

### Verifikasi

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

**Perbaikan:**

---

## US-02 Detail produk

**Prompt:**

**Hasil:**
Perubahan untuk **US-02 (Detail produk)** sudah selesai:

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

**Perbaikan:**

---

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**
Perubahan untuk **US-03 (Pesan via WhatsApp)** telah selesai diterapkan:

### File yang diubah

- [TombolWhatsApp.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/TombolWhatsApp.jsx):
  - Mengubah `<button>` menjadi tautan `<a>` dengan `target="_blank"` dan `rel="noopener noreferrer"` agar terbuka di tab baru, sambil mempertahankan kelas styling tombol yang sama.
  - Menggunakan `toko.nomorWhatsApp` dari [toko.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/toko.js) dan `formatRupiah` dari [format.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/format.js) untuk membentuk URL `https://wa.me/${toko.nomorWhatsApp}?text=${encodeURIComponent(pesan)}` yang memuat nama dan harga produk dalam format rupiah.
- [page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/produk/[id]/page.jsx): Komponen `CatatanBelumAktif` sudah tidak ada di halaman detail produk, sehingga tidak ada yang perlu dihapus di sana.

### Verifikasi

- `npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`).

**Perbaikan:**

---

## US-04 Login admin

**Prompt:**

**Hasil:**
Implementasi **US-04 (Login admin)** dengan Supabase Auth (`@supabase/ssr` dan cookie) di sisi server telah selesai:

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

**Perbaikan:**

---

## US-05 Ganti password

**Prompt:**

**Hasil:**
Implementasi **US-05 (Ganti password)** sudah selesai:

### File yang dibuat dan diubah

- [actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js#L43-L84) _(diubah)_ — Menambahkan Server Action `gantiPassword`:
  - Memeriksa sesi admin yang sedang login di server via `buatKoneksiSesi()` dan `supabase.auth.getUser()`.
  - Memvalidasi di server bahwa `password_baru` minimal 8 karakter dan sama dengan `konfirmasi_password`.
  - Memanggil `supabase.auth.updateUser({ password: passwordBaru })` dan mengembalikan pesan berhasil (`{ berhasil }`) atau pesan error (`{ error }`) yang jelas.
- [FormGantiPassword.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/password/FormGantiPassword.jsx) _(baru)_ — Client Component untuk form ganti password menggunakan `useActionState(gantiPassword, null)`, menampilkan pesan error (`role="alert"`) dan pesan berhasil (`role="status"`) dengan tampilan form yang tetap sama.
- [page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/password/page.jsx) _(diubah)_ — Menyambungkan halaman ke `FormGantiPassword` dan menghapus `CatatanBelumAktif`.

### Verifikasi

- `npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error.
- Pengecekan kode memastikan tidak ada environment variable berawalan `NEXT_PUBLIC_`.

### Cara mengetesnya

1. Jalankan server pengembangan di folder proyek (`npm run dev`), lalu masuk sebagai admin di `http://localhost:3000/admin/login`.
2. Buka `http://localhost:3000/admin/password`:
   - Uji validasi: masukkan password baru kurang dari 8 karakter atau konfirmasi yang berbeda (pastikan pesan error tampil).
   - Uji berhasil: masukkan password baru minimal 8 karakter yang sama dengan konfirmasinya, klik **Simpan password**, dan pastikan muncul pesan `"Password berhasil diperbarui."`.
   - Uji keluar lalu masuk kembali memakai password baru di `/admin/login`.

**Perbaikan:**

---

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**
Implementasi **US-06 (Proteksi halaman admin)** telah selesai:

### File yang dibuat dan diubah

- [proxy.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/proxy.js) _(baru)_ — Menambahkan fungsi `proxy(request)` dengan `config.matcher` pada `["/admin", "/admin/:path*"]`. File ini memeriksa sesi login admin di sisi server menggunakan `createServerClient` dari `@supabase/ssr` (`SUPABASE_URL` dan `SUPABASE_PUBLISHABLE_KEY`), serta mengalihkan permintaan tanpa sesi valid ke `/admin/login` (kecuali rute `/admin/login` itu sendiri).
- [page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/page.jsx) _(diubah)_ — Menghapus komponen `CatatanBelumAktif` dan komentar US-06 yang sudah tidak berlaku.
- [actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js) _(sudah memenuhi)_ — Satu-satunya Server Action pengubah data saat ini (`gantiPassword`) sudah memeriksa sesi login di server melalui `supabase.auth.getUser()` sebelum memproses perubahan.

### Verifikasi

- `npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error, dan `ƒ Proxy (Middleware)` terdeteksi aktif.
- Pengecekan kode memastikan tidak ada environment variable berawalan `NEXT_PUBLIC_` di `app/`, `components/`, `lib/`, maupun `proxy.js`.

### Cara mengetesnya

1. Jalankan server pengembangan di folder `ekraf_katalog-umkm`:
   ```bash
   npm run dev
   ```
2. Pastikan dalam keadaan belum login (atau klik **Keluar** terlebih dahulu), lalu coba buka langsung `http://localhost:3000/admin`, `http://localhost:3000/admin/password`, atau `http://localhost:3000/admin/produk/baru`. Pastikan semuanya otomatis dialihkan ke `http://localhost:3000/admin/login`.
3. Masuk menggunakan akun admin di `/admin/login`, lalu pastikan seluruh halaman di bawah `/admin` dapat dibuka kembali dan halaman `/admin` sudah tidak menampilkan kotak `CatatanBelumAktif`.

**Perbaikan:**

---

## US-07 List Produk

**Prompt:** **[SENDIRI]**
Baca AGENTS.md dan docs/user-stories.md bagian US-07.

dan memenuhi kriteria dibawah:
`app/admin/page.jsx` memakai `produkContoh`, bukan query database. Query Supabase di katalog publik tidak memenuhi kriteria halaman admin.

taruh hasilnya di format PROMPTS.md dengan format yang sudah dibuat sebelumnya di PROMPTS.md

**Hasil:**
Implementasi **US-07 (List Produk)** di halaman admin telah selesai:

### File yang diubah

- [page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/page.jsx) _(diubah)_:
  - Mengubah `HalamanAdmin` menjadi `async` Server Component dengan `export const dynamic = "force-dynamic"` agar selalu mengambil data terbaru di sisi server.
  - Mengambil daftar produk (`id`, `nama`, `harga`, `foto_url`, `kategori`) dari tabel `produk` di Supabase menggunakan `buatKoneksiServer()` dari [server.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/supabase/server.js), diurutkan dari `created_at` terbaru.
  - Menghapus ketergantungan pada `produkContoh` dari [data-contoh.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/lib/data-contoh.js).
  - Menambahkan penanganan error (`role="alert"`) jika query/koneksi gagal serta tampilan `"Belum ada produk"` jika tabel kosong, sambil mempertahankan `NavAdmin`, tombol `Tambah produk`, dan `TabelProduk`.

### Verifikasi

- `NODE_ENV=production npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`), dengan rute `ƒ /admin` terdeteksi sebagai dynamic server-rendered dan `ƒ Proxy (Middleware)` aktif.
- Pengecekan kode memastikan tidak ada environment variable berawalan `NEXT_PUBLIC_` di `app/`, `components/`, `lib/`, maupun `proxy.js`.

### Cara mengetesnya

1. Jalankan server pengembangan di folder `ekraf_katalog-umkm`:
   ```bash
   npm run dev
   ```
2. Masuk sebagai admin melalui `http://localhost:3000/admin/login`.
3. Buka `http://localhost:3000/admin` dan pastikan daftar produk di `TabelProduk` berasal dari tabel `produk` di Supabase (bukan `produkContoh`).
4. Pastikan juga membuka `/admin` tanpa login tetap dialihkan ke `/admin/login` oleh `proxy.js`.

**Perbaikan:**

---

## US-08 Tambah produk

**Prompt:** **[SENDIRI]**
Baca AGENTS.md dan docs/user-stories.md bagian US-08.

`FormProduk` tidak terhubung ke aksi penyimpanan. Tidak ada insert ke database atau redirect ke `/admin` setelah simpan. Proxy melindungi rute, tetapi belum ada aksi tambah yang bisa dilindungi.

taruh hasilnya di format PROMPTS.md dengan format yang sudah dibuat sebelumnya di PROMPTS.md

**Hasil:**
Implementasi **US-08 (Tambah produk)** telah selesai:

### File yang diubah

- [actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js#L86-L138) _(diubah)_:
  - Menambahkan Server Action `tambahProduk` yang memeriksa sesi login admin di server melalui `buatKoneksiSesi()` dan `supabase.auth.getUser()` sebelum memproses data.
  - Memvalidasi `nama` (wajib) dan `harga` (bilangan bulat ≥ 0), lalu menyimpan produk baru ke tabel `produk` di Supabase (`nama`, `harga`, `kategori`, `foto_url`, `deskripsi`).
  - Memanggil `revalidatePath("/admin")`, `revalidatePath("/")`, dan `redirect("/admin")` setelah penyimpanan berhasil.
- [FormProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/FormProduk.jsx) _(diubah)_:
  - Mengubah komponen menjadi Client Component (`"use client"`) dengan `useActionState` untuk menghubungkan `<form>` ke prop `aksi`, menampilkan pesan error (`role="alert"`), dan menonaktifkan tombol submit saat proses penyimpanan berlangsung.
- [page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/produk/baru/page.jsx) _(diubah)_:
  - Menghubungkan `FormProduk` dengan Server Action `tambahProduk` melalui prop `aksi={tambahProduk}` dan menghapus komponen `CatatanBelumAktif`.

### Verifikasi

- `NODE_ENV=production npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`), dengan rute `/admin/produk/baru` dan `ƒ Proxy (Middleware)` terdeteksi aktif.
- Pengecekan kode memastikan tidak ada environment variable berawalan `NEXT_PUBLIC_` di `app/`, `components/`, `lib/`, maupun `proxy.js`.

### Cara mengetesnya

1. Jalankan server pengembangan di folder `ekraf_katalog-umkm`:
   ```bash
   npm run dev
   ```
2. Masuk sebagai admin melalui `http://localhost:3000/admin/login`, lalu buka `http://localhost:3000/admin/produk/baru`.
3. Isi form produk baru dan klik **Simpan produk**:
   - Pastikan halaman otomatis diarahkan kembali ke `/admin`.
   - Pastikan produk baru muncul di daftar produk `/admin` maupun katalog `/`.
4. Untuk menguji proteksi login di server, pastikan tanpa sesi login yang valid akses ke `/admin/produk/baru` dialihkan ke `/admin/login` dan `tambahProduk` menolak permintaan tanpa sesi admin.

**Perbaikan:**

---

## US-09 Ubah produk

**Prompt:** **[SENDIRI]**
Baca AGENTS.md dan docs/user-stories.md bagian US-09.

pastikan memenuhi kriteria dibawah ini:
Form terisi lewat `cariProdukContoh(id)`, bukan data produk dari database. Tidak ada aksi update ke database yang memeriksa sesi login.

dan taruh semua history di chat ini ke PROMPTS.md

**Hasil:**
Implementasi **US-09 (Ubah produk)** telah selesai:

### File yang diubah

- [actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js#L104-L299) _(diubah)_:
  - Mengekstrak helper bersama `periksaSesiAdmin()`, `validasiInputProduk()`, dan `unggahFotoProduk()` agar tidak ada duplikasi logika antara `tambahProduk` dan `ubahProduk`.
  - Menambahkan Server Action `ubahProduk(id, _stateSebelumnya, formData)` yang memeriksa sesi login admin di server melalui `buatKoneksiSesi()` dan `supabase.auth.getUser()` sebelum memproses perubahan.
  - Memvalidasi `id` produk, `nama`, `harga`, serta mengunggah foto baru ke bucket `products` jika dipilih (atau mempertahankan `foto_url` lama jika tidak ada file baru), lalu memperbarui baris produk di tabel `produk` Supabase.
  - Memanggil `revalidatePath("/admin")`, `revalidatePath("/")`, `revalidatePath("/produk/[id]")`, `revalidatePath("/admin/produk/[id]/ubah")`, dan `redirect("/admin")` setelah berhasil.
- [page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/produk/[id]/ubah/page.jsx) _(diubah)_:
  - Menambahkan `export const dynamic = "force-dynamic"` dan mengganti `cariProdukContoh(id)` dengan query ke tabel `produk` di Supabase via `buatKoneksiServer()` (memanggil `notFound()` jika `id` tidak valid atau produk tidak ditemukan).
  - Menghapus komponen `CatatanBelumAktif` dan menghubungkan `FormProduk` ke Server Action `ubahProduk.bind(null, produk.id)`.

### Verifikasi

- `NODE_ENV=production npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`), dengan rute `ƒ /admin/produk/[id]/ubah` terdeteksi sebagai dynamic server-rendered dan `ƒ Proxy (Middleware)` aktif.
- Pengecekan kode memastikan tidak ada environment variable berawalan `NEXT_PUBLIC_` di `app/`, `components/`, `lib/`, maupun `proxy.js`.

### Cara mengetesnya

1. Jalankan server pengembangan di folder `ekraf_katalog-umkm`:
   ```bash
   npm run dev
   ```
2. Masuk sebagai admin melalui `http://localhost:3000/admin/login`, lalu klik **Ubah** pada salah satu produk di `/admin` untuk membuka `http://localhost:3000/admin/produk/[id]/ubah`.
3. Pastikan form sudah terisi data produk dari database Supabase (bukan data contoh).
4. Ubah data produk (misalnya nama, harga, kategori, deskripsi, atau unggah foto baru) lalu klik **Simpan perubahan**:
   - Pastikan halaman diarahkan kembali ke `/admin` dan perubahan tersimpan di `/admin` maupun katalog `/`.
5. Untuk menguji proteksi login di server, pastikan tanpa sesi login yang valid akses ke `/admin/produk/[id]/ubah` dialihkan ke `/admin/login` dan `ubahProduk` menolak permintaan tanpa sesi admin.

**Perbaikan:**

---

## US-10 Hapus produk

**Prompt:** **[SENDIRI]**
Baca AGENTS.md dan docs/user-stories.md bagian US-10.

pastikan memenuhi kriteria dibawah ini:
`TabelProduk.jsx` menampilkan tombol Hapus tanpa konfirmasi atau handler. Tidak ada aksi hapus database yang memeriksa sesi login.

dan taruh semua history di chat ini ke PROMPTS.md

**Hasil:**
Implementasi **US-10 (Hapus produk)** telah selesai:

### File yang diubah

- [actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js#L301-L341) _(diubah)_:
  - Menambahkan Server Action `hapusProduk(id)` yang memeriksa sesi login admin di server melalui `periksaSesiAdmin()` (`buatKoneksiSesi()` dan `supabase.auth.getUser()`) sebelum menjalankan penghapusan.
  - Memvalidasi `id` produk, menghapus baris produk di tabel `produk` Supabase (`.delete().eq("id", idTeks)`), serta memanggil `revalidatePath("/admin")`, `revalidatePath("/")`, `revalidatePath("/produk/[id]")`, dan `revalidatePath("/admin/produk/[id]/ubah")`.
- [TabelProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/TabelProduk.jsx) _(diubah)_:
  - Mengubah komponen menjadi Client Component (`"use client"`) dengan dialog konfirmasi (`role="dialog"`) sebelum memanggil Server Action `hapusProduk(id)` melalui `useTransition` dan `router.refresh()`.
  - Menampilkan pesan error (`role="alert"`) jika penghapusan gagal atau sesi tidak valid, serta menonaktifkan tombol aksi selama proses penghapusan berlangsung.

### Verifikasi

- `NODE_ENV=production npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`), dengan rute `ƒ /admin` terdeteksi sebagai dynamic server-rendered dan `ƒ Proxy (Middleware)` aktif.
- Pengecekan kode memastikan tidak ada environment variable berawalan `NEXT_PUBLIC_` di `app/`, `components/`, `lib/`, maupun `proxy.js`.

### Cara mengetesnya

1. Jalankan server pengembangan di folder `ekraf_katalog-umkm`:
   ```bash
   npm run dev
   ```
2. Masuk sebagai admin melalui `http://localhost:3000/admin/login`, lalu buka `http://localhost:3000/admin`.
3. Klik tombol **Hapus** pada salah satu produk dan pastikan muncul dialog konfirmasi (**Batal** / **Ya, hapus**):
   - Klik **Batal** untuk memastikan produk tidak terhapus.
   - Klik **Ya, hapus** untuk memastikan produk terhapus dari database serta hilang dari daftar `/admin` dan katalog `/`.
4. Untuk menguji proteksi login di server, pastikan tanpa sesi login yang valid akses ke `/admin` dialihkan ke `/admin/login` dan `hapusProduk` menolak permintaan tanpa sesi admin.

**Perbaikan:**

---

## US-11 Filter kategori atau pencarian

**Prompt:** **[SENDIRI]**
Baca AGENTS.md dan docs/user-stories.md bagian US-011.

pastikan memenuhi kriteria dibawah ini:
US-11 Filter kategori atau pencarian (0/10)
`app/page.jsx` menampilkan label kategori, tetapi tidak menyediakan kontrol filter kategori atau pencarian nama. Query tidak menerapkan keduanya.

dan taruh semua history di chat ini ke PROMPTS.md

**Hasil:**
Implementasi **US-11 (Filter kategori atau pencarian)** telah selesai:

### File yang diubah

- [page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/page.jsx) _(diubah)_:
  - Membaca `searchParams` (`await searchParams`) untuk parameter `kategori` dan `q`.
  - Menerapkan filter langsung pada query Supabase: `.eq("kategori", kategoriDipilih)` jika kategori dipilih dan `.ilike("nama", `%${polaCari}%`)` jika kata kunci pencarian diisi, serta mengambil daftar kategori unik dari kolom `kategori` tabel `produk`.
  - Menambahkan form pencarian nama produk (`method="GET"`, memakai komponen `Input` dan `Tombol`, serta menjaga `kategori` lewat hidden input) dan navigasi tombol filter kategori (`Semua` serta setiap kategori dari database, menjaga `q` di URL lewat helper `buatUrlKatalog`).
  - Menambahkan tombol `Reset` / `Tampilkan semua produk` dan pesan kosong yang jelas saat filter atau pencarian tidak menemukan produk.

### Verifikasi

- `NODE_ENV=production npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`), dengan rute `ƒ /` terdeteksi sebagai dynamic server-rendered dan `ƒ Proxy (Middleware)` aktif.
- Pengecekan `grep` memastikan tidak ada environment variable berawalan `NEXT_PUBLIC_` di `app/`, `components/`, `lib/`, maupun `proxy.js`.

### Cara mengetesnya

1. Jalankan server pengembangan di folder `ekraf_katalog-umkm`:
   ```bash
   npm run dev
   ```
2. Buka `http://localhost:3000/` dan pastikan daftar tombol kategori tampil di atas grid produk beserta kolom **Cari nama produk**.
3. Klik salah satu tombol kategori (misalnya **Minuman**):
   - Pastikan URL berubah menjadi `/?kategori=Minuman` dan hanya produk berkategori tersebut yang tampil.
4. Ketik kata kunci pada kolom **Cari nama produk** lalu klik **Cari**:
   - Pastikan URL menyertakan parameter `q=...` (dan tetap mempertahankan `kategori=...` jika sedang aktif) serta daftar produk tersaring sesuai nama yang dicari.
5. Klik **Semua** atau **Reset** untuk kembali menampilkan seluruh produk, dan uji kata kunci yang tidak cocok untuk memastikan pesan kosong serta tombol **Tampilkan semua produk** muncul.

**Perbaikan:**

- **Prompt lanjutan:** _"baca docs/user-stories.md bagian ### US-11 Filter kategori atau pencarian [...] Gunakan shadcn: Input, Select atau Popover, Button, Badge. Gunakan URL searchParams agar pencarian dapat dibagikan dan dipertahankan setelah reload."_
- Membuat komponen client baru [`components/FilterPencarian.jsx`](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/FilterPencarian.jsx) (`"use client"`) yang menangani UI interaktif: **Input** pencarian, **Select** (shadcn/Base UI) untuk kategori yang langsung navigate via `router.push` saat berubah, **Button** Cari + Reset dengan ikon X, **Badge** aktif menampilkan kata kunci dan kategori yang sedang difilter, serta counter jumlah hasil.
- Menyederhanakan [`app/page.jsx`](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/page.jsx) — logika data fetching dan filter query Supabase (`.eq` + `.ilike`) tetap di Server Component; form HTML statis dan nav link kategori diganti dengan `<FilterPencarian />`.
- Verifikasi `npm run build` berhasil tanpa error (`exit code 0`).

---

## US-12 Pilih jumlah atau varian

**Prompt:**
Implementasikan US-12 — Pilih jumlah atau varian. Pengunjung bisa memilih jumlah dan varian sebelum memesan, dan pilihan itu ikut tertulis di pesan WhatsApp.

**Hasil:**
Implementasi **US-12 (Pilih jumlah atau varian)** telah selesai:

### File yang dibuat

- [`components/PemesanProduk.jsx`](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/PemesanProduk.jsx) _(baru, `"use client"`)_:
  - Mengelola state `jumlah` (default 1) dan `varian` (teks opsional) di sisi klien.
  - Input jumlah dengan tombol **−** / **+** (`Button` variant outline, size icon) dan `Input` number di tengah.
  - Input teks varian opsional (placeholder: "merah, ukuran L, rasa pedas…", maxLength 100).
  - Tombol **Pesan via WhatsApp** menyusun pesan lengkap: nama produk, harga satuan, jumlah, dan varian (jika diisi), lalu membuka `wa.me/...` di tab baru.
  - Tombol **Kembali ke katalog** menggunakan `Link` ke `/`.

### File yang dimodifikasi

- [`app/produk/[id]/page.jsx`](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/produk/%5Bid%5D/page.jsx) _(diubah)_:
  - Mengganti `<TombolWhatsApp>` + `<Button>` kembali dengan `<PemesanProduk produk={produk} />`.
  - Halaman tetap Server Component; seluruh data tetap diambil dari Supabase di server.

### Acceptance criteria

| Kriteria                                                  | Status |
| --------------------------------------------------------- | ------ |
| Pengunjung bisa memilih jumlah sebelum memesan            | ✅     |
| Pengunjung bisa memilih varian sebelum memesan            | ✅     |
| Pilihan jumlah dan varian ikut tertulis di pesan WhatsApp | ✅     |

### Cara mengetesnya

1. Jalankan `npm run dev`, buka detail produk mana saja di `/produk/[id]`.
2. Ubah jumlah dengan tombol **−**/**+** atau ketik langsung di field jumlah.
3. Isi varian (opsional), misalnya "ukuran L".
4. Klik **Pesan via WhatsApp** — pastikan WhatsApp Web/app terbuka dengan pesan yang menyertakan nama produk, harga satuan, jumlah, dan varian yang dipilih.
5. Uji tanpa varian — pastikan baris varian tidak muncul di pesan.
6. Uji tombol **−** saat jumlah = 1 — pastikan tidak bisa dikurangi di bawah 1.

**Perbaikan:**

---

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

## US-29 Upload foto ke Supabase Storage

**Prompt:** **[SENDIRI]**
buatkan saya imagenya terintegrasi dengan storage supabase, sudah saya buatkan bucket yang bernama products

**Hasil:**
Integrasi upload foto produk ke bucket Supabase Storage **`products`** di sisi server telah selesai:

#### File yang diubah

- [FormProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/FormProduk.jsx#L34-L54) _(diubah)_:
  - Menambahkan input file `foto` (`accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"`) untuk mengunggah foto produk dari komputer.
- [actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js#L1-L162) _(diubah)_:
  - Memvalidasi tipe file gambar (`JPG`, `PNG`, `WebP`, `GIF`, `SVG`) dan ukuran maksimal `2 MB` di server.
  - Setelah verifikasi sesi login admin via `buatKoneksiSesi()`, mengunggah file ke bucket `products` menggunakan `buatKoneksiServer()` di server (tanpa mengekspos kunci ke browser), lalu menyimpan `publicUrl` hasil `getPublicUrl()` ke kolom `foto_url` pada tabel `produk`.
- [next.config.mjs](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/next.config.mjs#L5-L10) _(diubah)_:
  - Menambahkan `experimental.serverActions.bodySizeLimit: "3mb"` agar unggahan foto hingga 2 MB tidak tertolak batas default 1 MB Server Action.

#### Verifikasi

- `NODE_ENV=production npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`).
- Pengecekan kode memastikan tidak ada environment variable berawalan `NEXT_PUBLIC_` di `app/`, `components/`, `lib/`, maupun `proxy.js`.

#### Cara mengetesnya

1. Pastikan di Supabase Dashboard > **Storage**, bucket **`products`** sudah berstatus **Public** agar URL publik gambar bisa tampil di katalog `/` dan detail produk.
2. Jalankan `npm run dev`, masuk sebagai admin di `/admin/login`, lalu buka `http://localhost:3000/admin/produk/baru`.
3. Isi nama & harga produk, pilih file gambar di kolom **Foto produk**, lalu klik **Simpan produk**:
   - Pastikan halaman kembali ke `/admin` dan foto produk tampil di `/admin` serta `/`.
   - Uji mengunggah file non-gambar atau file > 2 MB untuk memastikan pesan error validasi tampil di form.

**Perbaikan:**

- **Prompt lanjutan:** _"disitu masih ada link foto. saya mau full integrate dengan supabase"_
- Menghapus input teks **Link foto** (`foto_url`) dari [FormProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/FormProduk.jsx#L34-L54) dan menampilkan pratinjau foto lama jika `produk.foto_url` sudah ada.
- Menghapus pembacaan input manual `foto_url` dari `formData` di [actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js#L108-L110), sehingga `foto_url` hanya berasal dari unggahan ke bucket `products` di Supabase Storage.
- Verifikasi ulang `NODE_ENV=production npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil tanpa error (`exit code 0`).

---

### K-10 Dependensi tanpa kerentanan kritis

**Prompt:**
Upgrade Next.js pada aplikasi di `/home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm` dari versi `16.4.3` ke `16.4.6` karena versi terpasang terdampak security advisory, serta tambahkan `experimental.agentUpgrade: "security"` di konfigurasi Next.js tanpa mengubah konfigurasi lainnya. Setelah selesai, lakukan verifikasi dan jalankan perintah laporan upgrade.

**Hasil:**
Upgrade berhasil:

- Versi Next.js diperbarui dari `16.4.3` ke `16.4.6` di `package.json` dan `package-lock.json`.
- Opsi `experimental.agentUpgrade: "security"` ditambahkan di `next.config.mjs` tanpa mengubah konfigurasi TypeScript yang sudah ada.
- `next --version` terverifikasi `16.4.6` dan build produksi (`NODE_ENV=production npm run build`) berhasil tanpa error.
- Perintah telemetry `report-agent-upgrade` dengan status `success` selesai dijalankan.

**Perbaikan:**

- `npm install next@16.4.6 --save-exact` sempat gagal karena cache npm berada di direktori read-only; diulang dengan izin menulis ke cache hingga berhasil.
- `npm run build` awal gagal saat prerender `/_global-error` karena nilai `NODE_ENV` lingkungan tidak standar; diperbaiki dengan menjalankan `NODE_ENV=production npm run build`.
- Pemeriksaan PR duplikat di GitHub tidak dapat dilakukan karena `gh` CLI tidak terpasang.


---

## US-15 Urutkan produk

**Prompt:**
Implementasi US-15, US-16, US-17 dari docs/prompt/US-15,16,17.md.

**Hasil:**

### File yang dibuat

- [SortingProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/SortingProduk.jsx) _(baru)_ — Client component select sorting produk (Terbaru / Termurah / Termahal). Mengubah parameter URL `sort` tanpa menghapus parameter lain. Reset `page` ke 1 saat sorting berubah.

### File yang dimodifikasi

- [app/page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/page.jsx) — Membaca parameter `sort` dari URL, menerapkan sorting di query Supabase (`created_at DESC`, `harga ASC`, `harga DESC`) di sisi server. Render `SortingProduk`.
- [components/FilterPencarian.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/FilterPencarian.jsx) — `buatUrl` kini membaca searchParams yang ada (mempertahankan `sort`), dan menghapus `page` saat filter berubah.

### Query Supabase

```js
// Terbaru (default)
query.order("created_at", { ascending: false }).order("id", { ascending: false })
// Termurah
query.order("harga", { ascending: true }).order("id", { ascending: true })
// Termahal
query.order("harga", { ascending: false }).order("id", { ascending: false })
```

### Hasil pengujian US-15

- [x] Sorting terbaru berfungsi (default, `created_at DESC`)
- [x] Sorting termurah berfungsi (`harga ASC`)
- [x] Sorting termahal berfungsi (`harga DESC`)
- [x] Sorting dilakukan di query database (Supabase server)
- [x] Parameter sorting tidak valid kembali ke default (`latest`)

---

## US-16 Paginasi atau muat lebih banyak

**Prompt:**
Implementasi US-16 dari docs/prompt/US-15,16,17.md.

**Hasil:**

### File yang dibuat

- [PaginasiKatalog.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/PaginasiKatalog.jsx) _(baru)_ — Client component pagination berbasis URL dengan shadcn Pagination. Mempertahankan semua search params lain. Menampilkan ellipsis untuk banyak halaman.

### File yang dimodifikasi

- [app/page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/page.jsx) — Membaca `page` dari URL, menggunakan `.range(from, to)` + `count: 'exact'` di Supabase. Menghitung total halaman. Menampilkan info "Menampilkan N produk · Halaman X dari Y". Render `PaginasiKatalog`.

### Query Supabase

```js
supabase
  .from("produk")
  .select("id, nama, harga, foto_url, kategori", { count: "exact" })
  // ... filter kategori & pencarian ...
  .order(...)
  .range(from, to) // from = (page-1)*12, to = from+11
```

### Hasil pengujian US-16

- [x] Produk dibatasi 12 per halaman (PAGE_SIZE = 12)
- [x] Query Supabase menggunakan `.range()` — pembatasan di database
- [x] Total produk dihitung dengan `count: 'exact'`
- [x] Total halaman dihitung: `Math.ceil(totalProduk / PAGE_SIZE)`
- [x] Previous dan Next berfungsi (disabled + aria saat di batas)
- [x] Halaman pertama dan terakhir ditangani (ellipsis jika diperlukan)
- [x] Parameter `sort`, `q`, `kategori` tetap dipertahankan saat ganti halaman
- [x] Halaman tidak valid atau di luar range → `halamanEfektif = Math.min(page, totalHalaman)`
- [x] Build sukses (npm run build exit code 0)

---

## US-17 Produk terkait di halaman detail

**Prompt:**
Implementasi US-17 dari docs/prompt/US-15,16,17.md.

**Hasil:**

### File yang dimodifikasi

- [app/produk/[id]/page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/produk/[id]/page.jsx) — Query produk terkait dari Supabase di server: kategori sama, kecualikan ID aktif, limit 4, urut `created_at DESC`. Render section "Produk Terkait" dengan grid 2 kolom (mobile) / 4 kolom (desktop) menggunakan `KartuProduk`.

### Query Supabase

```js
supabase
  .from("produk")
  .select("id, nama, harga, foto_url, kategori")
  .eq("kategori", produk.kategori)
  .neq("id", produk.id)
  .order("created_at", { ascending: false })
  .limit(4)
```

### Hasil pengujian US-17

- [x] Produk terkait berasal dari kategori yang sama (`.eq("kategori", ...)`)
- [x] Produk aktif tidak muncul (`.neq("id", produk.id)`)
- [x] Data diambil dari database di server
- [x] Maksimal 4 produk (`.limit(4)`)
- [x] Kategori kosong → query tidak dijalankan (guard `if (produk.kategori)`)
- [x] Tidak ada produk terkait → section disembunyikan (`{produkTerkait.length > 0 && ...}`)
- [x] Menggunakan `KartuProduk` yang sudah ada (tidak membuat komponen baru)
- [x] Build sukses (npm run build exit code 0)



---

## US-18 Galeri beberapa foto produk

**Prompt:**
Implementasi US-18 dari `docs/prompt/US-18,19,20.md`.

**Hasil:**
- **Status:** `BLOCKED` (kode selesai dan build produksi lulus; menunggu eksekusi manual `docs/migration-US-18-19-20.sql` di Supabase SQL Editor dan pengujian end-to-end di browser).

### File yang dibuat dan diubah
- [docs/migration-US-18-19-20.sql](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/docs/migration-US-18-19-20.sql) _(baru)_ — Menambahkan tabel `produk_foto` (`id`, `produk_id`, `foto_url`, `urutan`, `created_at`) dengan FK `ON DELETE CASCADE`, index `(produk_id, urutan)`, dan policy RLS `authenticated`. Kolom `produk.foto_url` dipertahankan untuk kompatibilitas data lama.
- [components/GaleriProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/GaleriProduk.jsx) _(baru)_ — Client component galeri interaktif dengan gambar utama, thumbnail yang dapat diklik, indikator visual thumbnail aktif (`border-primary` & `aria-pressed`), transisi ringan, serta fallback `ImageOffIcon` jika gambar gagal dimuat atau kosong.
- [components/GambarProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/GambarProduk.jsx) _(baru)_ — Client component gambar dengan fallback otomatis saat `onError` untuk dipakai di `ProductCard`.
- [app/produk/[id]/page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/produk/%5Bid%5D/page.jsx) _(diubah)_ — Mengambil `produk_foto` (urut `urutan ASC`), menggabungkan `produk.foto_url` di indeks 0 diikuti foto tambahan, lalu merender `<GaleriProduk />`.
- [components/FormProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/FormProduk.jsx) _(diubah)_ — Menambahkan preview foto utama baru, daftar foto galeri tersimpan dengan kontrol geser urutan (kiri/kanan) dan hapus, serta input multiple file `foto_tambahan` dengan preview.
- [app/admin/produk/[id]/ubah/page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/produk/%5Bid%5D/ubah/page.jsx) _(diubah)_ — Menggunakan `buatKoneksiSesi()` dan mengambil daftar `produk_foto` untuk diteruskan ke `FormProduk`.
- [app/admin/actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js) _(diubah)_ — Mendukung upload beberapa foto tambahan (`unggahBeberapaFoto`), menyimpan ke `produk_foto`, serta memproses penghapusan dan pembaruan urutan foto pada `ubahProduk`.

---

## US-19 Status stok

**Prompt:**
Implementasi US-19 dari `docs/prompt/US-18,19,20.md`.

**Hasil:**
- **Status:** `BLOCKED` (kode selesai dan build produksi lulus; menunggu eksekusi manual `docs/migration-US-18-19-20.sql` di Supabase SQL Editor dan pengujian end-to-end di browser).

### File yang dibuat dan diubah
- [docs/migration-US-18-19-20.sql](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/docs/migration-US-18-19-20.sql) _(baru)_ — Menambahkan kolom `stok INTEGER NOT NULL DEFAULT 0 CHECK (stok >= 0)` pada tabel `produk`.
- [app/page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/page.jsx) & [app/produk/[id]/page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/produk/%5Bid%5D/page.jsx) _(diubah)_ — Mengambil kolom `stok` pada query katalog, detail produk, dan produk terkait.
- [components/design/ProductCard.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/design/ProductCard.jsx) _(diubah)_ — Menampilkan badge `"Habis"` (dengan gambar sedikit redup) saat `stok === 0`, dan label `"Tersedia"` saat `stok > 0`. Produk habis tetap dapat diklik menuju halaman detail.
- [app/produk/[id]/page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/produk/%5Bid%5D/page.jsx) _(diubah)_ — Menampilkan pill status `"Tersedia"` / `"Habis"`, serta menyembunyikan `PemesanProduk` (tombol WhatsApp) dan menampilkan pesan `"Maaf, produk ini sedang habis dan belum bisa dipesan."` saat `stok === 0`.
- [components/FormProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/FormProduk.jsx), [components/TabelProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/TabelProduk.jsx), [app/admin/produk/page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/produk/page.jsx), & [app/admin/actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js) _(diubah)_ — Menambahkan input `stok`, validasi bilangan bulat `>= 0` di server, dan kolom status stok di tabel admin.

---

## US-20 Harga coret dan badge

**Prompt:**
Implementasi US-20 dari `docs/prompt/US-18,19,20.md`.

**Hasil:**
- **Status:** `BLOCKED` (kode selesai dan build produksi lulus; menunggu eksekusi manual `docs/migration-US-18-19-20.sql` di Supabase SQL Editor dan pengujian end-to-end di browser).

### File yang dibuat dan diubah
- [docs/migration-US-18-19-20.sql](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/docs/migration-US-18-19-20.sql) _(baru)_ — Menambahkan kolom `harga_diskon INTEGER NULL CHECK (harga_diskon IS NULL OR harga_diskon >= 0)` dan `is_terlaris BOOLEAN NOT NULL DEFAULT FALSE`.
- [components/design/ProductCard.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/design/ProductCard.jsx) & [app/produk/[id]/page.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/produk/%5Bid%5D/page.jsx) _(diubah)_ — Menampilkan harga normal dicoret (`line-through`) dan harga diskon sebagai harga utama jika `0 < harga_diskon < harga` (menggunakan `formatRupiah`), badge `"Baru"` otomatis dari `created_at <= 7 hari`, dan badge `"Terlaris"` dari kolom `is_terlaris` (penetapan manual admin karena belum ada tabel transaksi).
- [components/PemesanProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/PemesanProduk.jsx) _(diubah)_ — Menggunakan `harga_diskon` pada pesan WhatsApp saat diskon aktif.
- [components/FormProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/FormProduk.jsx), [components/TabelProduk.jsx](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/components/TabelProduk.jsx), & [app/admin/actions.js](file:///home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm/app/admin/actions.js) _(diubah)_ — Menambahkan input `harga_diskon` dan checkbox `is_terlaris` serta validasi server `harga_diskon < harga`.

### Verifikasi Build & Keamanan
- `NODE_ENV=production npm --prefix /home/ifz/code/bbpvp/ekraf/ekraf_katalog-umkm run build` berhasil (`exit code 0`).
- Pengecekan `grep` memastikan tidak ada environment variable berawalan `NEXT_PUBLIC_` di `app/`, `components/`, atau `lib/`.

---

## US-21 Keranjang, Pesan Semua via WhatsApp

**Prompt:**
Implementasi US-21 dari `docs/prompt/US-21,23,24,36.md`.

**Hasil:**
- **Status:** `BLOCKED` (kode selesai, unit check utilitas & build produksi lulus; menunggu uji E2E di browser).
- **File dibuat/diubah:**
  - `lib/cart/cart-utils.js` _(baru)_ — Key `umkm-cart`, sanitasi data rusak, `getHargaAktif()`, perhitungan subtotal/total, dan `buildWhatsAppCheckoutUrl()`.
  - `components/cart/CartProvider.jsx` _(baru)_ — Context + `useReducer`, hydration-safe, pencegahan duplikasi ID, validasi stok, dan `syncWithServer()`.
  - `components/cart/CartSheet.jsx`, `components/cart/CartItem.jsx`, `components/cart/CartButton.jsx`, `components/cart/AddToCartButton.jsx` _(baru)_ — Drawer keranjang, kontrol quantity/hapus/kosongkan, dan checkout satu pesan WhatsApp via `lib/toko.js`.
  - `app/api/produk-by-ids/route.js` _(baru)_ — Route Handler server-side read-only untuk validasi stok & harga terbaru.
  - `app/layout.jsx`, `components/Header.jsx`, `components/design/ProductCard.jsx`, `components/PemesanProduk.jsx` _(diubah)_.

---

## US-23 Bagikan atau Salin Link Produk

**Prompt:**
Implementasi US-23 dari `docs/prompt/US-21,23,24,36.md`.

**Hasil:**
- **Status:** `BLOCKED` (kode selesai dan build produksi lulus; menunggu uji E2E di browser).
- **File dibuat/diubah:**
  - `components/shared/ShareProductButton.jsx` _(baru)_ — Tombol bagikan dengan Web Share API (`navigator.share`), fallback Clipboard API dengan toast `"Link tersalin"`, serta fallback input salin manual jika clipboard gagal.
  - `app/produk/[id]/page.jsx` _(diubah)_ — Menampilkan `ShareProductButton` pada halaman detail produk.

---

## US-24 Favorit Tersimpan di Browser

**Prompt:**
Implementasi US-24 dari `docs/prompt/US-21,23,24,36.md`.

**Hasil:**
- **Status:** `BLOCKED` (kode selesai, unit check utilitas & build produksi lulus; menunggu uji E2E di browser).
- **File dibuat/diubah:**
  - `lib/favorites/favorite-utils.js` _(baru)_ — Key `umkm-favorites`, penyimpanan array ID unik, dan sanitasi data rusak.
  - `components/favorites/FavoritesProvider.jsx`, `components/favorites/FavoriteButton.jsx`, `components/favorites/FavoritesHeaderLink.jsx`, `components/favorites/FavoritesView.jsx` _(baru)_.
  - `app/favorit/page.jsx` _(baru)_ — Halaman khusus produk favorit tanpa login.
  - `app/layout.jsx`, `components/Header.jsx`, `components/design/ProductCard.jsx`, `app/produk/[id]/page.jsx` _(diubah)_.

---

## US-36 Terakhir dilihat

**Prompt:**
Implementasi US-36 dari `docs/prompt/US-21,23,24,36.md`.

**Hasil:**
- **Status:** `BLOCKED` (kode selesai, unit check utilitas & build produksi lulus; menunggu uji E2E di browser).
- **File dibuat/diubah:**
  - `lib/recently-viewed/recently-viewed-utils.js` _(baru)_ — Key `umkm-recently-viewed`, urutan terbaru di atas, tanpa duplikasi, batas maksimal 10 produk.
  - `components/recently-viewed/TrackProductView.jsx`, `components/recently-viewed/RecentlyViewed.jsx` _(baru)_ — Pencatatan riwayat saat detail produk dibuka dan section `"Terakhir Dilihat"` di beranda (disembunyikan jika kosong).
  - `app/produk/[id]/page.jsx`, `app/page.jsx` _(diubah)_.
