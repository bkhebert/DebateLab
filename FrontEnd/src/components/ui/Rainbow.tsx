import React from "react";
import { cn } from "../../lib/utils";
import { rainbowButtonVariants } from "./RainbowButton";
import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof rainbowButtonVariants> {
  asChild?: boolean;
}
const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        data-slot="button"
        className={cn(rainbowButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

RainbowButton.displayName = "RainbowButton";

export default RainbowButton