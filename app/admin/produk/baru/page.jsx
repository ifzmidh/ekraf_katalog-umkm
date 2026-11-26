import FormProduk from "@/components/FormProduk";
import { tambahProduk } from "@/app/admin/actions";

// US-08: tambah produk.
export default function HalamanTambahProduk() {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <p className="text-sm text-muted-foreground">Lengkapi informasi produk sebelum dipublikasikan ke katalog.</p>
      <FormProduk labelTombol="Simpan produk" aksi={tambahProduk} />
    </div>
  );
}
