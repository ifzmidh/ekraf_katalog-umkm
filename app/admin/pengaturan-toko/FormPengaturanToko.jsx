"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2Icon, SaveIcon, StoreIcon } from "lucide-react";
import { toast } from "sonner";
import { simpanPengaturanToko } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function FormPengaturanToko({ initialData }) {
  const [state, formAction, isPending] = useActionState(
    simpanPengaturanToko,
    null
  );

  const [namaToko, setNamaToko] = useState(initialData.nama_toko || "");
  const [nomorWhatsapp, setNomorWhatsapp] = useState(
    initialData.nomor_whatsapp || ""
  );
  const [jamBuka, setJamBuka] = useState(initialData.jam_buka || "");
  const [alamat, setAlamat] = useState(initialData.alamat || "");
  const [deskripsi, setDeskripsi] = useState(initialData.deskripsi || "");

  useEffect(() => {
    if (!state) return;

    if (state.values) {
      setNamaToko(state.values.nama_toko ?? "");
      setNomorWhatsapp(state.values.nomor_whatsapp ?? "");
      setJamBuka(state.values.jam_buka ?? "");
      setAlamat(state.values.alamat ?? "");
      setDeskripsi(state.values.deskripsi ?? "");
    }

    if (state.berhasil) {
      toast.success(state.berhasil);
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center gap-2">
          <StoreIcon className="size-5 text-primary" aria-hidden="true" />
          <div>
            <CardTitle>Identitas & Kontak Toko</CardTitle>
            <CardDescription>
              Informasi ini ditampilkan di header, footer, halaman tentang, dan
              dipakai untuk pemesanan WhatsApp.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form action={formAction} className="flex flex-col gap-5">
          {state?.error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {state.error}
            </div>
          )}

          {state?.berhasil && (
            <div
              role="status"
              className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-700 dark:text-emerald-300"
            >
              {state.berhasil}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="nama_toko">
                Nama toko <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nama_toko"
                name="nama_toko"
                type="text"
                required
                maxLength={120}
                value={namaToko}
                onChange={(e) => setNamaToko(e.target.value)}
                placeholder="Contoh: Raja Roster"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nomor_whatsapp">
                Nomor WhatsApp <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nomor_whatsapp"
                name="nomor_whatsapp"
                type="tel"
                inputMode="tel"
                required
                value={nomorWhatsapp}
                onChange={(e) => setNomorWhatsapp(e.target.value)}
                placeholder="Contoh: 081234567890 atau 6281234567890"
              />
              <p className="text-xs text-muted-foreground">
                Nomor lokal (awalan 0) otomatis dinormalisasi menjadi kode negara
                62 tanpa tanda +.
              </p>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="jam_buka">
              Jam operasional <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="jam_buka"
              name="jam_buka"
              rows={2}
              required
              maxLength={300}
              value={jamBuka}
              onChange={(e) => setJamBuka(e.target.value)}
              placeholder="Contoh: Setiap hari, 08.00–20.00"
            />
            <p className="text-xs text-muted-foreground">
              Bisa satu baris atau beberapa baris (misal jadwal per hari).
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="alamat">
              Alamat toko <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="alamat"
              name="alamat"
              rows={3}
              required
              maxLength={500}
              value={alamat}
              onChange={(e) => setAlamat(e.target.value)}
              placeholder="Masukkan alamat lengkap toko"
            />
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label htmlFor="deskripsi">
              Profil / deskripsi toko{" "}
              <span className="text-xs font-normal text-muted-foreground">
                (opsional)
              </span>
            </Label>
            <Textarea
              id="deskripsi"
              name="deskripsi"
              rows={4}
              maxLength={2000}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Ceritakan produk unggulan atau profil singkat toko Anda untuk ditampilkan di halaman Tentang."
            />
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2Icon
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Menyimpan...
                </>
              ) : (
                <>
                  <SaveIcon className="size-4" aria-hidden="true" />
                  Simpan pengaturan
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
