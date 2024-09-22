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
        red: "border-red-300 bg-red-200 text-primary shadow-sm",
        orange: "border-orange-300 bg-orange-200 text-primary shadow-sm",
        amber: "border-amber-300 bg-amber-200 text-primary shadow-sm",
        yellow: "border-yellow-300 bg-yellow-200 text-primary shadow-sm",
        lime: "border-lime-300 bg-lime-200 text-primary shadow-sm",
        green: "border-green-300 bg-green-200 text-primary shadow-sm",
        emerald: "border-emerald-300 bg-emerald-200 text-primary shadow-sm",
        teal: "border-teal-300 bg-teal-200 text-primary shadow-sm",
        cyan: "border-cyan-300 bg-cyan-200 text-primary shadow-sm",
        sky: "border-sky-300 bg-sky-200 text-primary shadow-sm",
        blue: "border-blue-300 bg-blue-200 text-primary shadow-sm",
        indigo: "border-indigo-300 bg-indigo-200 text-primary shadow-sm",
        violet: "border-violet-300 bg-violet-200 text-primary shadow-sm",
        purple: "border-purple-300 bg-purple-200 text-primary shadow-sm",
        fuchsia: "border-fuchsia-300 bg-fuchsia-200 text-primary shadow-sm",
        pink: "border-pink-300 bg-pink-200 text-primary shadow-sm",
        rose: "border-rose-300 bg-rose-200 text-primary shadow-sm",
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
