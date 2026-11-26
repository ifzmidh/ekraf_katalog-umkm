import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function LoadingState({ variant = "cards", className }) {
  if (variant === "table") {
    return (
      <div className={cn("overflow-hidden rounded-xl border bg-card", className)} aria-label="Memuat data">
        <Skeleton className="h-11 w-full rounded-none" />
        <div className="space-y-3 p-4">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-3", className)} aria-label="Memuat produk">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div key={item} className="overflow-hidden rounded-xl border bg-card p-3">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="mt-4 h-3 w-1/3" />
          <Skeleton className="mt-3 h-5 w-4/5" />
          <Skeleton className="mt-4 h-6 w-1/2" />
        </div>
      ))}
    </div>
  );
}
