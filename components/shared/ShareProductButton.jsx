"use client";

import { useState } from "react";
import { Share2Icon, CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToko } from "@/components/TokoProvider";

export default function ShareProductButton({ productId, productName }) {
  const toko = useToko();
  const [copied, setCopied] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState("");

  function getPublicUrl() {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/produk/${productId}`;
  }

  async function copyToClipboard(url) {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setFallbackUrl("");
      toast.success("Link tersalin");
      setTimeout(() => setCopied(false), 2000);
      return true;
    }
    return false;
  }

  async function handleShare() {
    const url = getPublicUrl();
    if (!url) return;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: productName,
          text: `Lihat ${productName} di ${toko.nama}`,
          url,
        });
        return;
      } catch (err) {
        // Pengguna membatalkan dialog share bawaan -> tidak perlu error.
        if (err && err.name === "AbortError") {
          return;
        }
        // Error lain: lanjut ke fallback Clipboard API.
      }
    }

    try {
      const ok = await copyToClipboard(url);
      if (!ok) {
        setFallbackUrl(url);
        toast.error("Browser tidak mendukung salin otomatis. Salin link secara manual.");
      }
    } catch {
      setFallbackUrl(url);
      toast.error("Gagal menyalin link. Silakan salin link secara manual.");
    }
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleShare}
      >
        {copied ? (
          <>
            <CheckIcon className="size-4 text-emerald-600" aria-hidden="true" />
            Link tersalin
          </>
        ) : (
          <>
            <Share2Icon className="size-4" aria-hidden="true" />
            Bagikan Produk
          </>
        )}
      </Button>

      {fallbackUrl && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 p-2">
          <Input
            type="text"
            readOnly
            value={fallbackUrl}
            onClick={(e) => e.currentTarget.select()}
            aria-label="Link produk untuk disalin manual"
            className="h-8 text-xs"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            onClick={() => {
              const input = document.querySelector(
                'input[aria-label="Link produk untuk disalin manual"]'
              );
              if (input) {
                input.select();
              }
            }}
            aria-label="Pilih link"
          >
            <CopyIcon className="size-3.5" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  );
}
