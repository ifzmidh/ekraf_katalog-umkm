"use client";

import { useEffect } from "react";
import { addRecentlyViewedId } from "@/lib/recently-viewed/recently-viewed-utils";

export default function TrackProductView({ productId }) {
  useEffect(() => {
    if (productId) {
      addRecentlyViewedId(productId);
    }
  }, [productId]);

  return null;
}
