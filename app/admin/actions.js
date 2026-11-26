"use server";

import { redirect } from "next/navigation";
import { buatKoneksiSesi } from "@/lib/supabase/server";

export async function masukAdmin(_stateSebelumnya, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let berhasil = false;

  try {
    const supabase = await buatKoneksiSesi();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (error.code === "invalid_credentials" || error.status === 400) {
        return { error: "Email atau password salah." };
      }
      return { error: "Gagal masuk ke akun admin. Silakan coba lagi." };
    }

    berhasil = true;
  } catch {
    return { error: "Terjadi kesalahan pada server saat memproses login." };
  }

  if (berhasil) {
    redirect("/admin");
  }
}

export async function keluarAdmin() {
  const supabase = await buatKoneksiSesi();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
