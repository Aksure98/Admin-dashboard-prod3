"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/utils/utils";
import { CheckIcon } from "@phosphor-icons/react";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-gray-300 bg-white data-[state=checked]:bg-[#0077b6] data-[state=checked]:text-white data-[state=checked]:border-[#0077b6] focus-visible:border-[#0077b6] focus-visible:ring-[#0077b6]/20 aria-invalid:ring-red-500/20 aria-invalid:border-red-500 size-4 shrink-0 rounded border transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 hover:border-[#0077b6]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" weight="bold" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
