"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { gantiPassword } from "../actions";

export default function FormGantiPassword() {
  const [state, formAction, sedangProses] = useActionState(gantiPassword, null);

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-4">
      {state?.error ? (
        <p
          role="alert"
          className="rounded-lg border border-bahaya/40 bg-bahaya/5 px-3 py-2 text-sm font-medium text-bahaya"
        >
          {state.error}
        </p>
      ) : null}
      {state?.berhasil ? (
        <p
          role="status"
          className="rounded-lg border border-utama/40 bg-utama/5 px-3 py-2 text-sm font-medium text-utama"
        >
          {state.berhasil}
        </p>
      ) : null}
      <Input
        label="Password baru"
        name="password_baru"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Input
        label="Ulangi password baru"
        name="konfirmasi_password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Tombol type="submit" className="self-start" disabled={sedangProses}>
        {sedangProses ? "Menyimpan..." : "Simpan password"}
      </Tombol>
    </form>
  );
}
