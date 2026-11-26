import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

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

/**
 * Membuat koneksi Supabase berbasis cookie sesi admin memakai @supabase/ssr.
 * Hanya digunakan di sisi server (Server Component, Server Action, Route Handler).
 */
export async function buatKoneksiSesi() {
  const url = process.env.SUPABASE_URL;
  const kunci = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !kunci) {
    throw new Error("Variabel lingkungan SUPABASE_URL atau SUPABASE_PUBLISHABLE_KEY belum diatur.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, kunci, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Diabaikan jika dipanggil dari Server Component yang tidak dapat menulis cookie.
        }
      },
    },
  });
}
