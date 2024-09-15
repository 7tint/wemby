"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider_ = TooltipPrimitive.Provider;

const Tooltip_ = TooltipPrimitive.Root;

const TooltipTrigger_ = TooltipPrimitive.Trigger;

const TooltipContent_ = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
));
TooltipContent_.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip_, TooltipTrigger_, TooltipContent_, TooltipProvider_ };

const Tooltip = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <TooltipProvider_>
    <Tooltip_>
      <TooltipTrigger_>{children}</TooltipTrigger_>
      <TooltipContent_>
        <p className="inline-block max-w-72">{label}</p>
      </TooltipContent_>
    </Tooltip_>
  </TooltipProvider_>
);

export default Tooltip;
