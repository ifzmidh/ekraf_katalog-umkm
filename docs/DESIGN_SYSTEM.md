# Design System — Katalog UMKM

Design system ini memakai Tailwind CSS 4 dan primitives `shadcn/ui` berbasis Base UI. Tujuannya menjaga storefront tetap hangat dan berorientasi produk, sementara area admin dapat memakai bahasa visual SaaS yang netral, tanpa mengubah data atau alur aplikasi.

## Prinsip

- Gunakan komponen `components/ui/*` sebagai primitive: Button, Card, Input, Dialog, Table, dan seterusnya.
- Gunakan komponen `components/design/*` untuk pola aplikasi yang berulang.
- Gunakan utility token semantik (`bg-background`, `text-muted-foreground`, `border-border`) untuk komponen baru. Jangan menulis nilai warna langsung di JSX.
- Token domain lama (`bg-latar`, `bg-utama`, `text-teks`, dan lain-lain) tetap didukung untuk halaman yang belum dimigrasikan.
- Jangan pindahkan query Supabase, Server Action, atau validasi ke komponen UI.

## Warna dan token

Semua token berada di `app/globals.css`, memakai CSS variables dan dipetakan ke utility Tailwind v4.

| Token | Storefront light | Penggunaan |
| --- | --- | --- |
| `background` | Cream hangat | Latar halaman publik |
| `foreground` | Cokelat gelap | Teks utama |
| `primary` | Terracotta | CTA utama, terutama WhatsApp dan aksi penting |
| `secondary`, `muted` | Cream muda | Latar pendukung dan teks sekunder |
| `accent` | Peach lembut | Penekanan non-kritis |
| `card` | Putih | Kartu produk dan panel |
| `border`, `input`, `ring` | Netral hangat | Garis, form, dan focus state |
| `destructive` | Merah | Aksi atau pesan berbahaya |

`.dark` menyediakan versi gelap yang tetap hangat dan berkontras. Kelas `.admin-theme` menimpa token yang sama dengan skala netral untuk shell dashboard; kombinasikan dengan `.dark` saat mode gelap admin diaktifkan. Jangan memakai `.admin-theme` pada storefront.

## Tipografi

- **Body dan UI:** Geist (`font-sans`), untuk keterbacaan form, tabel, dan navigasi.
- **Heading editorial:** `font-heading`/`font-display`, serif sistem untuk judul storefront dan section heading.
- **Judul halaman:** `text-3xl` hingga `text-4xl`, `font-semibold`, `tracking-tight`.
- **Judul section:** `text-2xl`, `font-semibold`.
- **Body:** `text-sm` atau `text-base`, warna `text-muted-foreground` untuk keterangan.
- **Label:** `text-sm font-medium` melalui `Label`/`FormField`.
- **Harga:** `text-lg font-semibold tracking-tight text-[var(--price)]`; jangan gunakan harga sebagai heading utama.

## Pola reusable

| Komponen | Tujuan | Aturan penggunaan |
| --- | --- | --- |
| `PageHeader` | Judul halaman, deskripsi, aksi kanan | Satu kali pada awal halaman. |
| `SectionHeading` | Judul blok konten | Pakai sebelum grid produk, tabel, atau section dashboard. |
| `ProductCard` | Kartu katalog publik | Menerima objek `produk` yang sudah ada. Menangani `foto_url` kosong. `KartuProduk` kini menjadi adapter kompatibel. |
| `EmptyState` | Kondisi tanpa data | Beri judul yang jelas, penjelasan singkat, dan maksimal satu CTA. |
| `LoadingState` | Placeholder sebelum data tersedia | Pilih `cards` untuk katalog atau `table` untuk daftar admin. |
| `FormField` | Label, bantuan, error per field | Letakkan Input/Textarea/Select sebagai `children`; sambungkan `id` yang unik. |
| `ConfirmDialog` | Aksi yang tidak mudah dibatalkan | Gunakan untuk hapus/nonaktif; `onConfirm` tetap menerima logic dari caller. |
| `StatCard` | Angka ringkas dashboard | Gunakan untuk satu metrik, bukan sebagai kartu navigasi. |

## Storefront

- Utamakan foto dengan rasio persegi, ruang putih, dan kartu ringan.
- Gunakan terracotta hanya untuk CTA atau state aktif agar tetap bernilai perhatian.
- CTA WhatsApp harus memakai `primary`, label eksplisit, dan mudah ditemukan pada halaman detail.
- Kategori gunakan `Badge variant="secondary"`; jangan memakai warna baru per kategori tanpa token.
- Lebar konten tetap `max-w-5xl`; grid katalog tetap 2 kolom mobile dan 3 kolom desktop sesuai `DESIGN.md`.

## Admin dashboard

- Saat shell admin didesain ulang, beri wrapper utama `className="admin-theme"`.
- Pakai Sidebar/Sheet untuk navigasi responsif, PageHeader untuk heading, StatCard untuk ringkasan, dan Table untuk daftar data.
- Gunakan spacing `gap-4`, `gap-6`, atau `gap-8` secara konsisten; form memakai `FormField` dengan jarak antar-field `gap-4`.
- Gunakan `AlertDialog`/`ConfirmDialog` untuk hapus dan tindakan destruktif. Jangan memakai modal untuk notifikasi biasa; gunakan Sonner bila notifikasi nanti diaktifkan.

## Aksesibilitas dan dark mode

- Selalu gunakan `Label` yang terhubung ke `id` input dan teks error yang jelas.
- Pertahankan `:focus-visible`; jangan menghapus ring fokus.
- Ikon Lucide bersifat dekoratif memakai `aria-hidden="true"`; tombol ikon harus mempunyai label atau `sr-only` text.
- Semua warna komponen harus memakai token semantik agar berganti konsisten pada `.dark` dan `.admin-theme.dark`.

## Contoh singkat

```jsx
<PageHeader
  eyebrow="Katalog"
  title="Produk pilihan"
  description="Temukan produk UMKM terbaik kami."
/>

<FormField id="nama" label="Nama produk" required>
  <Input id="nama" name="nama" />
</FormField>
```

Komponen baru tidak mengakses Supabase dan tidak mengandung Server Action. Halaman yang sudah ada dapat dimigrasikan secara bertahap pada pekerjaan redesign berikutnya.
