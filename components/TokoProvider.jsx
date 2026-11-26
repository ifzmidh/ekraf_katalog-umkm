"use client";

import { createContext, useContext } from "react";
import { toko as tokoFallback } from "@/lib/toko";

const TokoContext = createContext(tokoFallback);

export function TokoProvider({ initialToko, children }) {
  const value = initialToko || tokoFallback;
  return <TokoContext.Provider value={value}>{children}</TokoContext.Provider>;
}

export function useToko() {
  return useContext(TokoContext);
}
