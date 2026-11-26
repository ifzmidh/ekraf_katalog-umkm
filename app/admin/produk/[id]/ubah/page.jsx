import { notFound } from "next/navigation";
import FormProduk from "@/components/FormProduk";
import { buatKoneksiSesi } from "@/lib/supabase/server";
import { ubahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const supabase = await buatKoneksiSesi();
  const [hasilProduk, hasilFoto] = await Promise.all([
    supabase
      .from("produk")
      .select(
        "id, nama, harga, harga_diskon, stok, is_terlaris, deskripsi, foto_url, kategori"
      )
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("produk_foto")
      .select("id, foto_url, urutan")
      .eq("produk_id", id)
      .order("urutan", { ascending: true }),
  ]);

  if (hasilProduk.error) {
    console.error(
      "Gagal mengambil data produk untuk diubah:",
      hasilProduk.error.message
    );
  }

  const produk = hasilProduk.data;
  if (!produk) {
    notFound();
  }

  const produkDenganGaleri = {
    ...produk,
    fotoTambahan: hasilFoto.data ?? [],
  };

  const aksiUbah = ubahProduk.bind(null, produk.id);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        Perbarui informasi produk lalu simpan perubahan.
      </p>
      <FormProduk
        produk={produkDenganGaleri}
        labelTombol="Simpan perubahan"
        aksi={aksiUbah}
      />
    </div>
  );
}
