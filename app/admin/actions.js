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

export async function gantiPassword(_stateSebelumnya, formData) {
  const passwordBaru = String(formData.get("password_baru") || "");
  const konfirmasiPassword = String(formData.get("konfirmasi_password") || "");

  try {
    const supabase = await buatKoneksiSesi();
    const {
      data: { user },
      error: errorUser,
    } = await supabase.auth.getUser();

    if (errorUser || !user) {
      return { error: "Sesi login tidak valid. Silakan masuk kembali." };
    }

    if (passwordBaru.length < 8) {
      return { error: "Password baru minimal 8 karakter." };
    }

    if (passwordBaru !== konfirmasiPassword) {
      return { error: "Konfirmasi password tidak sama dengan password baru." };
    }

    const { error } = await supabase.auth.updateUser({
      password: passwordBaru,
    });

    if (error) {
      if (error.code === "same_password") {
        return { error: "Password baru tidak boleh sama dengan password lama." };
      }
      if (error.code === "weak_password") {
        return { error: "Password terlalu lemah. Gunakan kombinasi yang lebih kuat." };
      }
      return { error: "Gagal mengganti password. Silakan coba lagi." };
    }

    return { berhasil: "Password berhasil diperbarui." };
  } catch {
    return { error: "Terjadi kesalahan pada server saat mengganti password." };
  }
}
