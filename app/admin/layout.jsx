import AdminShell from "@/components/layout/admin-shell";
import { buatKoneksiSesi } from "@/lib/supabase/server";

export default async function LayoutAdmin({ children }) {
  let email = null;

  try {
    const supabase = await buatKoneksiSesi();
    const { data: { user } } = await supabase.auth.getUser();
    email = user?.email ?? null;
  } catch {
    // Proxy tetap menjaga rute dashboard; login tetap dapat dirender bila konfigurasi belum lengkap.
  }

  return <AdminShell email={email}>{children}</AdminShell>;
}
