"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, KeyRound, LogOut } from "lucide-react";
import { keluarAdmin } from "@/app/admin/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function informasiHalaman(pathname) {
  if (pathname === "/admin") return { title: "Dashboard", parent: null };
  if (pathname === "/admin/produk") return { title: "Produk", parent: "Dashboard" };
  if (pathname === "/admin/produk/baru") return { title: "Tambah produk", parent: "Produk" };
  if (pathname.includes("/ubah")) return { title: "Ubah produk", parent: "Produk" };
  if (pathname === "/admin/pengaturan-toko") return { title: "Pengaturan toko", parent: "Dashboard" };
  if (pathname === "/admin/password") return { title: "Ganti password", parent: "Pengaturan akun" };
  return { title: "Admin", parent: null };
}

export default function AdminHeader({ email }) {
  const { title, parent } = informasiHalaman(usePathname());
  const namaAdmin = email?.split("@")[0] || "Admin";
  const inisial = namaAdmin.slice(0, 2).toUpperCase();

  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <div className="md:hidden">{/* Tombol drawer dirender oleh sidebar pada mobile. */}</div>
        <div className="min-w-0">
          <Breadcrumb>
            <BreadcrumbList className="hidden sm:flex">
              <BreadcrumbItem><Link href="/admin" className="hover:text-foreground">Admin</Link></BreadcrumbItem>
              {parent ? <><BreadcrumbSeparator /><BreadcrumbItem>{parent === "Produk" ? <Link href="/admin/produk" className="hover:text-foreground">Produk</Link> : <span>{parent}</span>}</BreadcrumbItem></> : null}
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{title}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="truncate text-lg font-semibold tracking-tight sm:mt-1">{title}</h1>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" className="h-auto max-w-48 gap-2 px-1.5 py-1" />}>
          <Avatar size="sm"><AvatarFallback>{inisial}</AvatarFallback></Avatar>
          <span className="hidden min-w-0 text-left sm:block"><span className="block truncate text-sm font-medium">{namaAdmin}</span><span className="block truncate text-xs text-muted-foreground">{email}</span></span>
          <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
          <DropdownMenuLabel><p className="truncate font-medium">{namaAdmin}</p><p className="truncate text-xs font-normal text-muted-foreground">{email}</p></DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/admin/password" />}><KeyRound aria-hidden="true" /> Ganti password</DropdownMenuItem>
          <DropdownMenuSeparator />
          <form action={keluarAdmin}>
            <DropdownMenuItem variant="destructive" nativeButton={true} render={<button type="submit" className="w-full" />}><LogOut aria-hidden="true" /> Keluar</DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
