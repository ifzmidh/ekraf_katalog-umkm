"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { buatKoneksiServer, buatKoneksiSesi } from "@/lib/supabase/server";

const BUCKET_PRODUK = "products";
const UKURAN_MAKSIMAL_FOTO = 2 * 1024 * 1024;
const TIPE_FOTO_DIIZINKAN = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

export async function masukAdmin(_stateSebelumnya, formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let berhasil = false;

  try {
    const supabase = await buatKoneksiSesi();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

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
        return {
          error: "Password baru tidak boleh sama dengan password lama.",
        };
      }
      if (error.code === "weak_password") {
        return {
          error: "Password terlalu lemah. Gunakan kombinasi yang lebih kuat.",
        };
      }
      return { error: "Gagal mengganti password. Silakan coba lagi." };
    }

    return { berhasil: "Password berhasil diperbarui." };
  } catch {
    return { error: "Terjadi kesalahan pada server saat mengganti password." };
  }
}

async function periksaSesiAdmin() {
  const supabase = await buatKoneksiSesi();
  const {
    data: { user },
    error: errorUser,
  } = await supabase.auth.getUser();

  if (errorUser || !user) {
    return { error: "Sesi login tidak valid. Silakan masuk kembali." };
  }

  return { supabase };
}

function validasiInputProduk(formData) {
  const nama = String(formData.get("nama") || "").trim();
  const hargaTeks = String(formData.get("harga") || "").trim();
  const kategori = String(formData.get("kategori") || "").trim() || null;
  const deskripsi = String(formData.get("deskripsi") || "").trim() || null;
  const fotoFile = formData.get("foto");

  if (!nama) {
    return { error: "Nama produk wajib diisi." };
  }

  const harga = Number(hargaTeks);
  if (
    !hargaTeks ||
    !Number.isFinite(harga) ||
    !Number.isInteger(harga) ||
    harga < 0
  ) {
    return {
      error: "Harga produk harus berupa bilangan bulat 0 atau lebih.",
    };
  }

  return { nama, harga, kategori, deskripsi, fotoFile };
}

async function unggahFotoProduk(fotoFile) {
  if (!fotoFile || typeof fotoFile !== "object" || fotoFile.size <= 0) {
    return { fotoUrl: undefined };
  }

  if (!TIPE_FOTO_DIIZINKAN.has(fotoFile.type)) {
    return {
      error:
        "Format foto harus berupa gambar (JPG, PNG, WebP, GIF, atau SVG).",
    };
  }

  if (fotoFile.size > UKURAN_MAKSIMAL_FOTO) {
    return { error: "Ukuran foto maksimal 2 MB." };
  }

  const ekstensiAsli =
    String(fotoFile.name || "")
      .split(".")
      .pop()
      ?.toLowerCase() || "jpg";
  const ekstensiAman = ekstensiAsli.replace(/[^a-z0-9]/g, "") || "jpg";
  const namaFile = `produk-${Date.now()}-${crypto.randomUUID()}.${ekstensiAman}`;
  const buffer = Buffer.from(await fotoFile.arrayBuffer());

  const supabaseStorage = buatKoneksiServer();
  const { error: errorUpload } = await supabaseStorage.storage
    .from(BUCKET_PRODUK)
    .upload(namaFile, buffer, {
      contentType: fotoFile.type,
      upsert: false,
    });

  if (errorUpload) {
    return {
      error:
        "Gagal mengunggah foto ke Supabase Storage. Silakan coba lagi.",
    };
  }

  const { data: dataUrl } = supabaseStorage.storage
    .from(BUCKET_PRODUK)
    .getPublicUrl(namaFile);

  return { fotoUrl: dataUrl.publicUrl };
}

export async function tambahProduk(_stateSebelumnya, formData) {
  let berhasil = false;

  try {
    const sesi = await periksaSesiAdmin();
    if (sesi.error) {
      return { error: sesi.error };
    }

    const input = validasiInputProduk(formData);
    if (input.error) {
      return { error: input.error };
    }

    const hasilFoto = await unggahFotoProduk(input.fotoFile);
    if (hasilFoto.error) {
      return { error: hasilFoto.error };
    }

    const { error } = await sesi.supabase.from("produk").insert({
      nama: input.nama,
      harga: input.harga,
      kategori: input.kategori,
      foto_url: hasilFoto.fotoUrl ?? null,
      deskripsi: input.deskripsi,
    });

    if (error) {
      return {
        error: "Gagal menyimpan produk ke database. Silakan coba lagi.",
      };
    }

    berhasil = true;
  } catch {
    return { error: "Terjadi kesalahan pada server saat menyimpan produk." };
  }

  if (berhasil) {
    revalidatePath("/admin");
    revalidatePath("/");
    redirect("/admin");
  }
}

export async function ubahProduk(id, _stateSebelumnya, formData) {
  const idTeks = String(id || "").trim();
  let berhasil = false;

  try {
    const sesi = await periksaSesiAdmin();
    if (sesi.error) {
      return { error: sesi.error };
    }

    if (!/^\d+$/.test(idTeks)) {
      return { error: "ID produk tidak valid." };
    }

    const input = validasiInputProduk(formData);
    if (input.error) {
      return { error: input.error };
    }

    const hasilFoto = await unggahFotoProduk(input.fotoFile);
    if (hasilFoto.error) {
      return { error: hasilFoto.error };
    }

    const dataUpdate = {
      nama: input.nama,
      harga: input.harga,
      kategori: input.kategori,
      deskripsi: input.deskripsi,
    };
    if (hasilFoto.fotoUrl !== undefined) {
      dataUpdate.foto_url = hasilFoto.fotoUrl;
    }

    const { data: produkTerubah, error } = await sesi.supabase
      .from("produk")
      .update(dataUpdate)
      .eq("id", idTeks)
      .select("id")
      .maybeSingle();

    if (error) {
      return {
        error: "Gagal memperbarui produk di database. Silakan coba lagi.",
      };
    }

    if (!produkTerubah) {
      return { error: "Produk tidak ditemukan." };
    }

    berhasil = true;
  } catch {
    return { error: "Terjadi kesalahan pada server saat memperbarui produk." };
  }

  if (berhasil) {
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/produk/${idTeks}`);
    revalidatePath(`/admin/produk/${idTeks}/ubah`);
    redirect("/admin");
  }
}

export async function hapusProduk(id) {
  const idTeks = String(id || "").trim();

  try {
    const sesi = await periksaSesiAdmin();
    if (sesi.error) {
      return { error: sesi.error };
    }

    if (!/^\d+$/.test(idTeks)) {
      return { error: "ID produk tidak valid." };
    }

    const { data: produkTerhapus, error } = await sesi.supabase
      .from("produk")
      .delete()
      .eq("id", idTeks)
      .select("id")
      .maybeSingle();

    if (error) {
      return {
        error: "Gagal menghapus produk dari database. Silakan coba lagi.",
      };
    }

    if (!produkTerhapus) {
      return { error: "Produk tidak ditemukan." };
    }

    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath(`/produk/${idTeks}`);
    revalidatePath(`/admin/produk/${idTeks}/ubah`);

    return { berhasil: true };
  } catch {
    return { error: "Terjadi kesalahan pada server saat menghapus produk." };
  }
}
