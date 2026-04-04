"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
 "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-neutral-400 dark:focus-visible:border-neutral-600 focus-visible:ring-[3px] focus-visible:ring-neutral-400/50 dark:focus-visible:ring-neutral-600/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-red-500 dark:aria-invalid:border-red-400 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-400/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
 {
  variants: {
   variant: {
    default:
     "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 [a]:hover:bg-neutral-900/80 dark:[a]:hover:bg-neutral-100/80",
    secondary:
     "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 [a]:hover:bg-neutral-100/80 dark:[a]:hover:bg-neutral-800/80",
    destructive:
     "bg-red-500/10 text-red-500 dark:text-red-400 focus-visible:ring-red-500/20 dark:bg-red-500/20 dark:focus-visible:ring-red-400/40 [a]:hover:bg-red-500/20",
    outline:
     "border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 [a]:hover:bg-neutral-100 dark:[a]:hover:bg-neutral-800 [a]:hover:text-neutral-500 dark:[a]:hover:text-neutral-400",
    ghost:
     "hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:text-neutral-500 dark:hover:text-neutral-400",
    link: "text-neutral-900 dark:text-neutral-100 underline-offset-4 hover:underline",
   },
  },
  defaultVariants: {
   variant: "default",
  },
 }
);

function Badge({
 className,
 variant = "default",
 render,
 ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
 return useRender({
  defaultTagName: "span",
  props: mergeProps<"span">(
   {
    className: cn(badgeVariants({ variant }), className),
   },
   props
  ),
  render,
  state: {
   slot: "badge",
   variant,
  },
 });
}

export { Badge, badgeVariants };
