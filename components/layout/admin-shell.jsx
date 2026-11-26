"use client";

import { usePathname } from "next/navigation";
import AdminSidebar, { AdminMobileSidebar } from "@/components/layout/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";

export default function AdminShell({ children, email }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <main className="admin-theme min-h-screen bg-background px-4 text-foreground"><div className="mx-auto flex max-w-sm flex-col">{children}</div></main>;
  }

  return (
    <div className="admin-theme flex min-h-screen bg-background text-foreground">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-16 items-center border-b border-border px-4 md:hidden"><AdminMobileSidebar /></div>
        <AdminHeader email={email} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
