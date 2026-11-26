import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

/**
 * Memeriksa sesi login admin untuk seluruh rute /admin kecuali /admin/login.
 */
export async function proxy(request) {
  let response = NextResponse.next({ request });

  const url = process.env.SUPABASE_URL;
  const kunci = process.env.SUPABASE_PUBLISHABLE_KEY;

  const { pathname } = request.nextUrl;
  const adalahHalamanLogin =
    pathname === "/admin/login" || pathname.startsWith("/admin/login/");

  if (!url || !kunci) {
    if (adalahHalamanLogin) {
      return response;
    }
    const urlLogin = request.nextUrl.clone();
    urlLogin.pathname = "/admin/login";
    urlLogin.search = "";
    return NextResponse.redirect(urlLogin);
  }

  const supabase = createServerClient(url, kunci, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !adalahHalamanLogin) {
    const urlLogin = request.nextUrl.clone();
    urlLogin.pathname = "/admin/login";
    urlLogin.search = "";
    return NextResponse.redirect(urlLogin);
  }

  return response;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
