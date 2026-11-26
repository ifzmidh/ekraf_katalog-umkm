import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({ label, value, description, icon: Icon, className }) {
  return (
    <Card className={cn("py-0", className)}>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
          {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
        </div>
        {Icon ? (
          <span className="rounded-lg bg-muted p-2.5 text-muted-foreground">
            <Icon aria-hidden="true" className="size-5" />
          </span>
        ) : null}
      </CardContent>
    </Card>
  );
}
