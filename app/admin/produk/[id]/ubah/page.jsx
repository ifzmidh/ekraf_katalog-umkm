import { notFound } from "next/navigation";
import FormProduk from "@/components/FormProduk";
import { buatKoneksiServer } from "@/lib/supabase/server";
import { ubahProduk } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    notFound();
  }

  const supabase = buatKoneksiServer();
  const { data: produk, error } = await supabase
    .from("produk")
    .select("id, nama, harga, deskripsi, foto_url, kategori")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Gagal mengambil data produk untuk diubah:", error.message);
  }

  if (!produk) {
    notFound();
  }

  const aksiUbah = ubahProduk.bind(null, produk.id);

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <p className="text-sm text-muted-foreground">Perbarui informasi produk lalu simpan perubahan.</p>
      <FormProduk produk={produk} labelTombol="Simpan perubahan" aksi={aksiUbah} />
    </div>
  );
}
