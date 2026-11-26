import { PackageOpenIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  action,
  icon: Icon = PackageOpenIcon,
  className,
}) {
  const tombolAksi = action || (
    actionLabel && actionHref ? (
      <Button variant="outline" nativeButton={false} render={<a href={actionHref} />}>
        {actionLabel}
      </Button>
    ) : null
  );

  return (
    <div
      className={cn(
        "flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-10 text-center",
        className
      )}
    >
      <div className="mb-4 rounded-full bg-muted p-3 text-muted-foreground">
        <Icon aria-hidden="true" className="size-6" />
      </div>
      <h2 className="text-base font-semibold">{title}</h2>
      {description ? <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p> : null}
      {tombolAksi ? <div className="mt-5">{tombolAksi}</div> : null}
    </div>
  );
}
