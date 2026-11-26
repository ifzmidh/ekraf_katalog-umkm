"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { toast } from "sonner";
import {
  calculateCartTotals,
  loadCartFromStorage,
  saveCartToStorage,
} from "@/lib/cart/cart-utils";

const CartContext = createContext(null);

const initialState = {
  items: [],
  hydrated: false,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "HYDRATE":
      return {
        items: action.payload,
        hydrated: true,
      };

    case "ADD_ITEM": {
      const { produk, quantity } = action.payload;
      const productId = Number(produk.id);
      const stok =
        typeof produk.stok === "number" && produk.stok >= 0 ? produk.stok : null;
      const qtyToAdd = Number.isInteger(quantity) && quantity >= 1 ? quantity : 1;

      const existingIndex = state.items.findIndex(
        (item) => item.productId === productId
      );

      if (existingIndex >= 0) {
        const nextItems = [...state.items];
        const existing = nextItems[existingIndex];
        let nextQty = existing.quantity + qtyToAdd;
        if (stok !== null && stok > 0) {
          nextQty = Math.min(nextQty, stok);
        }
        nextItems[existingIndex] = {
          ...existing,
          nama: produk.nama,
          harga: Number(produk.harga),
          harga_diskon: produk.harga_diskon ?? null,
          stok,
          foto_url: produk.foto_url || null,
          quantity: nextQty,
          unavailable: false,
        };
        return { ...state, items: nextItems };
      }

      const initialQty =
        stok !== null && stok > 0 ? Math.min(qtyToAdd, stok) : qtyToAdd;

      return {
        ...state,
        items: [
          ...state.items,
          {
            productId,
            nama: produk.nama,
            harga: Number(produk.harga),
            harga_diskon: produk.harga_diskon ?? null,
            stok,
            foto_url: produk.foto_url || null,
            quantity: initialQty,
            unavailable: false,
          },
        ],
      };
    }

    case "UPDATE_QUANTITY": {
      const { productId, quantity } = action.payload;
      const nextQty = Number.isInteger(quantity) && quantity >= 1 ? quantity : 1;

      return {
        ...state,
        items: state.items.map((item) => {
          if (item.productId !== productId) return item;
          const clampedQty =
            typeof item.stok === "number" && item.stok > 0
              ? Math.min(nextQty, item.stok)
              : nextQty;
          return { ...item, quantity: clampedQty };
        }),
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.productId !== action.payload.productId
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    case "SYNC_PRODUCTS": {
      const serverMap = action.payload;
      const nextItems = state.items.map((item) => {
        const latest = serverMap.get(item.productId);
        if (!latest) {
          return { ...item, unavailable: true };
        }
        return {
          ...item,
          nama: latest.nama,
          harga: Number(latest.harga),
          harga_diskon: latest.harga_diskon ?? null,
          stok: typeof latest.stok === "number" ? latest.stok : null,
          foto_url: latest.foto_url || null,
          unavailable: false,
        };
      });
      return { ...state, items: nextItems };
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = loadCartFromStorage();
    dispatch({ type: "HYDRATE", payload: stored });
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    saveCartToStorage(state.items);
  }, [state.items, state.hydrated]);

  const addItem = useCallback(
    (produk, quantity = 1) => {
      if (!produk || !produk.id) return false;

      const stok =
        typeof produk.stok === "number" && produk.stok >= 0 ? produk.stok : null;

      if (stok === 0) {
        toast.error("Produk ini sedang habis dan belum bisa ditambahkan.");
        return false;
      }

      const qtyToAdd = Number.isInteger(quantity) && quantity >= 1 ? quantity : 1;
      const existing = state.items.find(
        (item) => item.productId === Number(produk.id)
      );

      if (existing && stok !== null && existing.quantity >= stok) {
        toast.warning(`Stok maksimal untuk ${produk.nama} hanya ${stok}.`);
        return false;
      }

      dispatch({
        type: "ADD_ITEM",
        payload: { produk, quantity: qtyToAdd },
      });

      if (existing && stok !== null && existing.quantity + qtyToAdd > stok) {
        toast.warning(
          `Jumlah ${produk.nama} disesuaikan ke batas stok (${stok}).`
        );
      } else {
        toast.success(`${produk.nama} ditambahkan ke keranjang`);
      }

      return true;
    },
    [state.items]
  );

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId: Number(productId), quantity },
    });
  }, []);

  const removeItem = useCallback((productId) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { productId: Number(productId) },
    });
    toast("Produk dihapus dari keranjang");
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
    toast("Keranjang dikosongkan");
  }, []);

  const syncWithServer = useCallback(async () => {
    if (state.items.length === 0) {
      return { ok: true, valid: true, items: [] };
    }

    const ids = state.items.map((item) => item.productId).join(",");
    try {
      const response = await fetch(`/api/produk-by-ids?ids=${ids}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        return { ok: false, valid: false, items: state.items };
      }

      const data = await response.json();
      const serverList = Array.isArray(data?.produk) ? data.produk : [];
      const serverMap = new Map(serverList.map((p) => [Number(p.id), p]));

      dispatch({ type: "SYNC_PRODUCTS", payload: serverMap });

      const syncedItems = state.items.map((item) => {
        const latest = serverMap.get(item.productId);
        if (!latest) {
          return { ...item, unavailable: true };
        }
        return {
          ...item,
          nama: latest.nama,
          harga: Number(latest.harga),
          harga_diskon: latest.harga_diskon ?? null,
          stok: typeof latest.stok === "number" ? latest.stok : null,
          foto_url: latest.foto_url || null,
          unavailable: false,
        };
      });

      const hasInvalid = syncedItems.some(
        (item) =>
          item.unavailable ||
          item.stok === 0 ||
          (typeof item.stok === "number" && item.quantity > item.stok)
      );

      return { ok: true, valid: !hasInvalid, items: syncedItems };
    } catch {
      return { ok: false, valid: false, items: state.items };
    }
  }, [state.items]);

  const { totalItems, totalPrice } = useMemo(
    () => calculateCartTotals(state.items),
    [state.items]
  );

  const value = useMemo(
    () => ({
      items: state.items,
      hydrated: state.hydrated,
      totalItems,
      totalPrice,
      isOpen,
      setIsOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      syncWithServer,
    }),
    [
      state.items,
      state.hydrated,
      totalItems,
      totalPrice,
      isOpen,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      syncWithServer,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart harus digunakan di dalam CartProvider");
  }
  return ctx;
}
