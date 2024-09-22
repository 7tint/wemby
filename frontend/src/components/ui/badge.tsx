import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary shadow-sm",
        outline: "border-slate-300 text-foreground shadow-sm",
        pink: "border-pink-300 bg-pink-200 text-primary shadow-sm",
        orange: "border-orange-300 bg-orange-200 text-primary shadow-sm",
        yellow: "border-yellow-300 bg-yellow-200 text-primary shadow-sm",
        lime: "border-lime-300 bg-lime-200 text-primary shadow-sm",
        sky: "border-sky-300 bg-sky-200 text-primary shadow-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
