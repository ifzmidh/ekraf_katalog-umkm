import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
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
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormProduk produk={produk} labelTombol="Simpan perubahan" aksi={aksiUbah} />
    </div>
  );
}
