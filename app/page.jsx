import Input from "@/components/Input";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

function buatUrlKatalog(kategori, kataKunci) {
  const params = new URLSearchParams();
  if (kategori) params.set("kategori", kategori);
  if (kataKunci) params.set("q", kataKunci);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export default async function HalamanKatalog({ searchParams }) {
  const params = await searchParams;
  const kategoriDipilih = typeof params?.kategori === "string" ? params.kategori.trim() : "";
  const kataKunci = typeof params?.q === "string" ? params.q.trim() : "";

  let daftarProduk = [];
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = buatKoneksiServer();

    let queryProduk = supabase
      .from("produk")
      .select("id, nama, harga, foto_url, kategori")
      .order("created_at", { ascending: false });

    if (kategoriDipilih) {
      queryProduk = queryProduk.eq("kategori", kategoriDipilih);
    }

    if (kataKunci) {
      const polaCari = kataKunci.replace(/[%_\\]/g, "\\$&");
      queryProduk = queryProduk.ilike("nama", `%${polaCari}%`);
    }

    const [hasilProduk, hasilKategori] = await Promise.all([
      queryProduk,
      supabase.from("produk").select("kategori").not("kategori", "is", null),
    ]);

    if (hasilProduk.error) {
      console.error("Gagal mengambil daftar produk:", hasilProduk.error.message);
      pesanError = "Gagal mengambil daftar produk dari database. Silakan muat ulang halaman.";
    } else {
      daftarProduk = hasilProduk.data ?? [];
    }

    if (!hasilKategori.error && hasilKategori.data) {
      const kategoriUnik = new Set();
      for (const baris of hasilKategori.data) {
        const nilai = typeof baris.kategori === "string" ? baris.kategori.trim() : "";
        if (nilai) kategoriUnik.add(nilai);
      }
      daftarKategori = Array.from(kategoriUnik).sort((a, b) => a.localeCompare(b, "id"));
    }
  } catch (err) {
    console.error("Gagal terhubung ke Supabase:", err);
    pesanError = "Gagal terhubung ke database. Periksa pengaturan server dan coba lagi.";
  }

  const adaFilterAktif = Boolean(kategoriDipilih || kataKunci);

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-5">
        <h2 id="judul-produk" className="text-xl font-bold">
          Produk kami
        </h2>

        <form
          key={`${kategoriDipilih}-${kataKunci}`}
          method="GET"
          action="/"
          className="flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          {kategoriDipilih && <input type="hidden" name="kategori" value={kategoriDipilih} />}
          <div className="flex-1">
            <Input
              label="Cari nama produk"
              name="q"
              type="search"
              defaultValue={kataKunci}
              placeholder="Contoh: kopi, keripik, batik..."
            />
          </div>
          <div className="flex gap-2">
            <Tombol type="submit">Cari</Tombol>
            {adaFilterAktif && (
              <Tombol href="/" varian="garis">
                Reset
              </Tombol>
            )}
          </div>
        </form>

        {daftarKategori.length > 0 && (
          <nav aria-label="Filter kategori" className="flex flex-wrap gap-2">
            <Tombol href={buatUrlKatalog("", kataKunci)} varian={!kategoriDipilih ? "utama" : "garis"}>
              Semua
            </Tombol>
            {daftarKategori.map((kategori) => (
              <Tombol
                key={kategori}
                href={buatUrlKatalog(kategori, kataKunci)}
                varian={kategoriDipilih === kategori ? "utama" : "garis"}
              >
                {kategori}
              </Tombol>
            ))}
          </nav>
        )}

        {pesanError ? (
          <p
            role="alert"
            className="rounded-lg border border-bahaya bg-permukaan px-4 py-3 text-sm text-bahaya"
          >
            {pesanError}
          </p>
        ) : daftarProduk.length === 0 ? (
          <div className="flex flex-col items-start gap-3 rounded-lg border border-garis bg-permukaan px-4 py-6 text-sm text-teks-lembut">
            <p>
              {adaFilterAktif
                ? "Tidak ada produk yang cocok dengan kategori atau kata kunci pencarian."
                : "Belum ada produk"}
            </p>
            {adaFilterAktif && (
              <Tombol href="/" varian="garis">
                Tampilkan semua produk
              </Tombol>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
