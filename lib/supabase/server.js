import { createClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi Supabase untuk sisi server memakai kunci rahasia.
 * Hanya digunakan di Server Component, Server Action, atau Route Handler.
 */
export function buatKoneksiServer() {
  const url = process.env.SUPABASE_URL;
  const kunci = process.env.SUPABASE_SECRET_KEY;

  if (!url || !kunci) {
    throw new Error("Variabel lingkungan SUPABASE_URL atau SUPABASE_SECRET_KEY belum diatur.");
  }

  return createClient(url, kunci, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
