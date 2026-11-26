import { Badge } from "@/components/ui/badge";
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

export const metadata = {
  title: "Demo shadcn/ui",
  robots: { index: false, follow: false },
};

/**
 * Halaman verifikasi sementara untuk memastikan primitives shadcn/ui
 * dapat diimpor pada App Router tanpa mengubah storefront atau admin.
 */
export default function HalamanDemoShadcn() {
  return (
    <section className="py-10 sm:py-14">
      <Card className="max-w-md">
        <CardHeader>
          <Badge className="w-fit">Verifikasi</Badge>
          <CardTitle>Komponen shadcn/ui siap digunakan</CardTitle>
          <CardDescription>
            Halaman sementara untuk memeriksa Button, Card, dan Input.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="demo-nama">Nama produk</Label>
            <Input id="demo-nama" placeholder="Contoh: Roster Minimalis" />
          </div>
          <Button type="button" className="self-start">
            Simpan contoh
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
