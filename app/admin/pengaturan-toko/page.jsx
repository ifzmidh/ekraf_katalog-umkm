import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLinkIcon } from "lucide-react";
import FormPengaturanToko from "./FormPengaturanToko";
import { Button } from "@/components/ui/button";
import { buatKoneksiSesi } from "@/lib/supabase/server";
import { toko } from "@/lib/toko";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pengaturan Toko",
};

export default async function HalamanPengaturanToko() {
  let initialData = {
    nama_toko: toko.nama,
    nomor_whatsapp: toko.nomorWhatsApp,
    jam_buka: toko.jamBuka,
    alamat: toko.alamat,
    deskripsi: "",
  };
  let sumberDatabase = false;
  let pesanPeringatan = null;

  try {
    const supabase = await buatKoneksiSesi();
    const {
      data: { user },
      error: errorUser,
    } = await supabase.auth.getUser();

    if (errorUser || !user) {
      redirect("/admin/login");
    }

    const { data, error } = await supabase
      .from("pengaturan_toko")
      .select("nama_toko, nomor_whatsapp, jam_buka, alamat, deskripsi")
      .eq("id", 1)
      .maybeSingle();

    if (error) {
      console.error("Gagal membaca pengaturan_toko:", error.message);
      pesanPeringatan =
        "Tabel pengaturan_toko belum siap di database. Form menampilkan nilai fallback dari lib/toko.js; jalankan docs/migration-US-22-43.sql di Supabase SQL Editor terlebih dahulu.";
    } else if (data) {
      sumberDatabase = true;
      initialData = {
        nama_toko: data.nama_toko || toko.nama,
        nomor_whatsapp: data.nomor_whatsapp || toko.nomorWhatsApp,
        jam_buka: data.jam_buka || toko.jamBuka,
        alamat: data.alamat ?? "",
        deskripsi: data.deskripsi ?? "",
      };
    } else {
      pesanPeringatan =
        "Pengaturan toko di database masih kosong, menampilkan nilai bawaan dari lib/toko.js. Klik Simpan pengaturan untuk menyimpan ke database.";
    }
  } catch (err) {
    // Biarkan redirect() Next.js lewat
    if (err && typeof err === "object" && "digest" in err) {
      throw err;
    }
    console.error("Gagal memuat halaman pengaturan toko:", err);
    pesanPeringatan =
      "Tidak dapat terhubung ke database. Menampilkan nilai fallback dari lib/toko.js.";
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Pengaturan Toko</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Perbarui identitas toko, jam operasional, alamat, dan nomor WhatsApp
            tanpa mengubah kode.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/tentang" target="_blank" />}
        >
          <ExternalLinkIcon aria-hidden="true" />
          Lihat halaman Tentang
        </Button>
      </div>

      {pesanPeringatan && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-300"
        >
          {pesanPeringatan}
        </div>
      )}

      <FormPengaturanToko
        key={sumberDatabase ? "db" : "fallback"}
        initialData={initialData}
      />
    </div>
  );
}
