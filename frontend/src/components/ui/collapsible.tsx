"use client";

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { ReactNode } from "react";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = ({ children }: { children: ReactNode }) => (
  <CollapsiblePrimitive.CollapsibleContent className="CollapsibleContent">
    {children}
  </CollapsiblePrimitive.CollapsibleContent>
);

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
