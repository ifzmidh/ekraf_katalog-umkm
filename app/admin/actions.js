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

  // US-19: stok
  const stokTeks = String(formData.get("stok") || "0").trim();
  const stok = Number(stokTeks);
  if (!Number.isFinite(stok) || !Number.isInteger(stok) || stok < 0) {
    return { error: "Stok harus berupa bilangan bulat 0 atau lebih." };
  }

  // US-20: harga_diskon & is_terlaris
  const hargaDiskonTeks = String(formData.get("harga_diskon") || "").trim();
  const isTerlaris = formData.get("is_terlaris") === "true";

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

  // Validasi harga_diskon
  let hargaDiskon = null;
  if (hargaDiskonTeks !== "" && hargaDiskonTeks !== "0") {
    const hd = Number(hargaDiskonTeks);
    if (!Number.isFinite(hd) || !Number.isInteger(hd) || hd < 0) {
      return {
        error: "Harga diskon harus berupa bilangan bulat 0 atau lebih.",
      };
    }
    if (hd >= harga) {
      return { error: "Harga diskon harus lebih rendah dari harga normal." };
    }
    hargaDiskon = hd;
  }

  return {
    nama,
    harga,
    hargaDiskon,
    stok,
    isTerlaris,
    kategori,
    deskripsi,
    fotoFile,
  };
}

async function unggahFotoProduk(fotoFile) {
  if (!fotoFile || typeof fotoFile !== "object" || fotoFile.size <= 0) {
    return { fotoUrl: undefined };
  }

  if (!TIPE_FOTO_DIIZINKAN.has(fotoFile.type)) {
    return {
      error: "Format foto harus berupa gambar (JPG, PNG, WebP, GIF, atau SVG).",
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
      error: "Gagal mengunggah foto ke Supabase Storage. Silakan coba lagi.",
    };
  }

  const { data: dataUrl } = supabaseStorage.storage
    .from(BUCKET_PRODUK)
    .getPublicUrl(namaFile);

  return { fotoUrl: dataUrl.publicUrl };
}

async function unggahBeberapaFoto(files) {
  const urls = [];
  for (const file of files) {
    if (!file || typeof file !== "object" || file.size <= 0) continue;
    const hasil = await unggahFotoProduk(file);
    if (hasil.error) {
      return { error: hasil.error };
    }
    if (hasil.fotoUrl) {
      urls.push(hasil.fotoUrl);
    }
  }
  return { urls };
}

function parseJsonIdArray(nilai) {
  if (!nilai) return [];
  try {
    const parsed = JSON.parse(String(nilai));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((v) => Number(v))
      .filter((n) => Number.isInteger(n) && n > 0);
  } catch {
    return [];
  }
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

    const fotoTambahanFiles = formData
      .getAll("foto_tambahan")
      .filter((f) => f && typeof f === "object" && f.size > 0);
    const hasilGaleri = await unggahBeberapaFoto(fotoTambahanFiles);
    if (hasilGaleri.error) {
      return { error: hasilGaleri.error };
    }

    const { data: produkBaru, error } = await sesi.supabase
      .from("produk")
      .insert({
        nama: input.nama,
        harga: input.harga,
        harga_diskon: input.hargaDiskon,
        stok: input.stok,
        is_terlaris: input.isTerlaris,
        kategori: input.kategori,
        foto_url: hasilFoto.fotoUrl ?? null,
        deskripsi: input.deskripsi,
      })
      .select("id")
      .single();

    if (error || !produkBaru) {
      return {
        error: "Gagal menyimpan produk ke database. Silakan coba lagi.",
      };
    }

    if (hasilGaleri.urls.length > 0) {
      const barisFoto = hasilGaleri.urls.map((url, idx) => ({
        produk_id: produkBaru.id,
        foto_url: url,
        urutan: idx,
      }));
      const { error: errorGaleri } = await sesi.supabase
        .from("produk_foto")
        .insert(barisFoto);

      if (errorGaleri) {
        return {
          error:
            "Produk tersimpan, tetapi gagal menyimpan foto galeri tambahan.",
        };
      }
    }

    berhasil = true;
  } catch {
    return { error: "Terjadi kesalahan pada server saat menyimpan produk." };
  }

  if (berhasil) {
    revalidatePath("/admin");
    revalidatePath("/admin/produk");
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

    const fotoTambahanFiles = formData
      .getAll("foto_tambahan")
      .filter((f) => f && typeof f === "object" && f.size > 0);
    const hasilGaleri = await unggahBeberapaFoto(fotoTambahanFiles);
    if (hasilGaleri.error) {
      return { error: hasilGaleri.error };
    }

    const dataUpdate = {
      nama: input.nama,
      harga: input.harga,
      harga_diskon: input.hargaDiskon,
      stok: input.stok,
      is_terlaris: input.isTerlaris,
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

    const hapusFotoIds = parseJsonIdArray(formData.get("hapus_foto_ids"));
    if (hapusFotoIds.length > 0) {
      const { error: errorHapus } = await sesi.supabase
        .from("produk_foto")
        .delete()
        .eq("produk_id", idTeks)
        .in("id", hapusFotoIds);

      if (errorHapus) {
        return { error: "Gagal menghapus foto galeri yang dipilih." };
      }
    }

    const urutanFotoLama = parseJsonIdArray(formData.get("urutan_foto_lama"));
    for (let idx = 0; idx < urutanFotoLama.length; idx++) {
      const { error: errorUrut } = await sesi.supabase
        .from("produk_foto")
        .update({ urutan: idx })
        .eq("id", urutanFotoLama[idx])
        .eq("produk_id", idTeks);

      if (errorUrut) {
        return { error: "Gagal memperbarui urutan foto galeri." };
      }
    }

    if (hasilGaleri.urls.length > 0) {
      const mulaiUrutan = urutanFotoLama.length;
      const barisFoto = hasilGaleri.urls.map((url, idx) => ({
        produk_id: Number(idTeks),
        foto_url: url,
        urutan: mulaiUrutan + idx,
      }));
      const { error: errorGaleri } = await sesi.supabase
        .from("produk_foto")
        .insert(barisFoto);

      if (errorGaleri) {
        return { error: "Gagal menyimpan foto galeri baru." };
      }
    }

    berhasil = true;
  } catch {
    return { error: "Terjadi kesalahan pada server saat memperbarui produk." };
  }

  if (berhasil) {
    revalidatePath("/admin");
    revalidatePath("/admin/produk");
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
