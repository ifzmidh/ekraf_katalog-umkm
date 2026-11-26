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

---

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.

### US-29 Upload foto ke Supabase Storage

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
