import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = React.forwardRef(
    ({ ...props }, ref) => (
        <PopoverPrimitive.Trigger
            ref={ref}
            data-slot="popover-trigger"
            {...props}
        />
    )
);
PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = React.forwardRef(
    ({ className, align = "center", sideOffset = 4, ...props }, ref) => (
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.Content
              ref={ref}
              data-slot="popover-content"
              align={align}
              sideOffset={sideOffset}
              className={cn(
                  "bg-popover text-popover-foreground z-50 w-72 rounded-md p-4 shadow-md outline-hidden",
                  className
              )}
              {...props}
          />
        </PopoverPrimitive.Portal>
    )
);
PopoverContent.displayName = "PopoverContent";

const PopoverAnchor = React.forwardRef(
    ({ ...props }, ref) => (
        <PopoverPrimitive.Anchor
            ref={ref}
            data-slot="popover-anchor"
            {...props}
        />
    )
);
PopoverAnchor.displayName = "PopoverAnchor";

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor };
