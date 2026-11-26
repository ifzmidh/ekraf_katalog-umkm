import Link from "next/link";
import { toko } from "@/lib/toko";

export default function Footer() {
  return (
    <footer id="tentang" className="mt-16 border-t bg-secondary/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-heading text-lg font-semibold text-foreground">{toko.nama}</p>
          <p className="mt-2 max-w-md leading-6">{toko.alamat}</p>
          <p className="mt-1">{toko.jamBuka}</p>
        </div>
        <Link href="/admin" className="self-start font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline">
          Masuk sebagai admin
        </Link>
      </div>
    </footer>
  );
}
