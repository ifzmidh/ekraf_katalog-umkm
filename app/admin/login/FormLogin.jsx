"use client";

import { useActionState } from "react";
import Input from "@/components/Input";
import Tombol from "@/components/Tombol";
import { masukAdmin } from "../actions";

export default function FormLogin() {
  const [state, formAction, sedangProses] = useActionState(masukAdmin, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state?.error ? (
        <p
          role="alert"
          className="rounded-lg border border-bahaya/40 bg-bahaya/5 px-3 py-2 text-sm font-medium text-bahaya"
        >
          {state.error}
        </p>
      ) : null}
      <Input label="Email" name="email" type="email" autoComplete="email" required />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <Tombol type="submit" disabled={sedangProses}>
        {sedangProses ? "Memproses..." : "Masuk"}
      </Tombol>
    </form>
  );
}
