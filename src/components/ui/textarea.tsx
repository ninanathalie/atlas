import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
 return (
  <textarea
   data-slot="textarea"
   className={cn(
    "flex field-sizing-content min-h-16 w-full rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-neutral-500 dark:placeholder:text-neutral-400 focus-visible:border-neutral-400 dark:focus-visible:border-neutral-600 focus-visible:ring-3 focus-visible:ring-neutral-400/50 dark:focus-visible:ring-neutral-600/50 disabled:cursor-not-allowed disabled:bg-neutral-100/50 disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-3 aria-invalid:ring-red-500/20 md:text-sm dark:bg-neutral-800/30 dark:disabled:bg-neutral-800/80 dark:aria-invalid:border-red-500/50 dark:aria-invalid:ring-red-400/40",
    className
   )}
   {...props}
  />
 );
}

export { Textarea };
