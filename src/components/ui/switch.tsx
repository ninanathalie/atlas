"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({
 className,
 size = "default",
 ...props
}: SwitchPrimitive.Root.Props & {
 size?: "sm" | "default";
}) {
 return (
  <SwitchPrimitive.Root
   data-slot="switch"
   data-size={size}
   className={cn(
    "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-600 focus-visible:ring-3 focus-visible:ring-neutral-400/50 dark:focus-visible:ring-neutral-600/50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-400/40 data-checked:bg-neutral-900 dark:data-checked:bg-neutral-100 data-unchecked:bg-neutral-100 dark:data-unchecked:bg-neutral-800/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
    className
   )}
   {...props}
  >
   <SwitchPrimitive.Thumb
    data-slot="switch-thumb"
    className="pointer-events-none block rounded-full bg-white dark:bg-neutral-950 ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-neutral-900 group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-neutral-100"
   />
  </SwitchPrimitive.Root>
 );
}

export { Switch };
