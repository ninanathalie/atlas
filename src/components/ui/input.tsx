import * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
 return (
  <InputPrimitive
   type={type}
   data-slot="input"
   className={cn(
    "h-8 w-full min-w-0 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-900 dark:file:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-600 focus-visible:ring-3 focus-visible:ring-neutral-400/50 dark:focus-visible:ring-neutral-600/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-neutral-100/50 disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 md:text-sm dark:bg-neutral-800/30 dark:disabled:bg-neutral-800/80 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-400/40",
    className
   )}
   {...props}
  />
 );
}

export { Input };
