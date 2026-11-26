"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDownIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OPSI_SORT = [
  { value: "latest", label: "Terbaru" },
  { value: "price_asc", label: "Termurah" },
  { value: "price_desc", label: "Termahal" },
];

export const SORT_DEFAULT = "latest";

export function sortValid(sort) {
  return OPSI_SORT.some((o) => o.value === sort) ? sort : SORT_DEFAULT;
}

/**
 * Kontrol sorting produk (client component).
 * Mengubah parameter URL `sort` tanpa menghapus parameter lain yang relevan.
 */
export default function SortingProduk({ sortAktif }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSortChange(nilai) {
    const params = new URLSearchParams(searchParams.toString());
    if (nilai === SORT_DEFAULT) {
      params.delete("sort");
    } else {
      params.set("sort", nilai);
    }
    // Reset ke halaman pertama saat sorting berubah
    params.delete("page");
    const query = params.toString();
    router.push(query ? `/?${query}#produk` : "/#produk");
  }

  const nilaiAktif = sortValid(sortAktif);

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDownIcon
        aria-hidden="true"
        className="hidden size-4 shrink-0 text-muted-foreground sm:block"
      />
      <Label htmlFor="sort-produk" className="shrink-0 text-sm">
        Urutkan
      </Label>
      <Select value={nilaiAktif} onValueChange={handleSortChange}>
        <SelectTrigger
          id="sort-produk"
          className="h-9 w-full sm:w-36"
          aria-label="Pilih urutan produk"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {OPSI_SORT.map((opsi) => (
            <SelectItem key={opsi.value} value={opsi.value}>
              {opsi.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
