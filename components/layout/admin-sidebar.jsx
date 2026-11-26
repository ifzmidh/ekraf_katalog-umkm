"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Tags, Store, MessageSquareText, History, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toko } from "@/lib/toko";

const navigasiUtama = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, cocok: (path) => path === "/admin" },
  { label: "Produk", href: "/admin/produk", icon: Package, cocok: (path) => path.startsWith("/admin/produk") },
];

const navigasiBertahap = [
  { label: "Kategori", icon: Tags },
  { label: "Pengaturan toko", icon: Store },
  { label: "Ulasan", icon: MessageSquareText },
  { label: "Aktivitas", icon: History },
];

function IsiNavigasi({ onNavigate }) {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi admin" className="flex flex-1 flex-col gap-6 px-3 py-4">
      <div>
        <p className="px-3 pb-2 text-xs font-medium text-muted-foreground">Utama</p>
        <div className="space-y-1">
          {navigasiUtama.map(({ label, href, icon: Icon, cocok }) => (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={cocok(pathname) ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                cocok(pathname)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div>
        <p className="px-3 pb-2 text-xs font-medium text-muted-foreground">Segera hadir</p>
        <div className="space-y-1">
          {navigasiBertahap.map(({ label, icon: Icon }) => (
            <span key={label} className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/70" title="Fitur ini belum tersedia">
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
}

function IdentitasToko() {
  return <p className="px-6 py-4 text-xs text-muted-foreground">Panel admin {toko.nama}</p>;
}

export function AdminMobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" aria-label="Buka navigasi" />}>
        <Menu aria-hidden="true" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 border-sidebar-border bg-sidebar p-0" showCloseButton>
        <SheetHeader className="border-b border-sidebar-border px-6 py-5">
          <SheetTitle>{toko.nama}</SheetTitle>
        </SheetHeader>
        <IsiNavigasi />
        <IdentitasToko />
      </SheetContent>
    </Sheet>
  );
}

export default function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <Link href="/admin" className="border-b border-sidebar-border px-6 py-5 text-base font-semibold text-sidebar-foreground">
        {toko.nama}
      </Link>
      <IsiNavigasi />
      <IdentitasToko />
    </aside>
  );
}
