"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
 Accordion,
 AccordionItem,
 AccordionTrigger,
 AccordionContent,
} from "@/components/ui/accordion";

interface WorkItem {
 id: string;
 title: string;
 subtitle?: string | null;
 description?: string | null;
 logoUrl?: string | null;
 location?: string | null;
 startDate?: string | null;
 endDate?: string | null;
}

interface WorkSectionProps {
 items: WorkItem[];
}

function LogoImage({ letter, logoUrl }: { letter: string; logoUrl?: string | null }) {
 if (logoUrl) {
  return (
   <span className="size-8 md:size-10 rounded-full border shadow ring-2 ring-neutral-200 dark:ring-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex-none overflow-hidden block">
    <Image src={logoUrl} alt="" width={40} height={40} className="size-full object-cover" />
   </span>
  );
 }

 return (
  <span className="size-8 md:size-10 p-1 border rounded-full shadow ring-2 ring-neutral-200 dark:ring-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex-none flex items-center justify-center text-xs font-semibold text-neutral-500 dark:text-neutral-400">
   {letter}
  </span>
 );
}

export function WorkSection({ items }: WorkSectionProps) {
 const [value, setValue] = useState<string | undefined>(items[0]?.id);

 if (items.length === 0) return null;

 return (
  <Accordion type="single" collapsible value={value} onValueChange={setValue}>
   {items.map((item) => (
    <AccordionItem key={item.id} value={item.id} className="border-none">
     <AccordionTrigger className="group flex w-full items-center gap-3 rounded-lg px-2 py-3 text-left hover:no-underline hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors [&>svg:last-child]:hidden">
      <LogoImage letter={item.title.charAt(0).toUpperCase()} logoUrl={item.logoUrl} />

      <div className="flex-1 min-w-0">
       <p className="text-sm font-medium leading-tight">{item.subtitle ?? item.title}</p>
       <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
        {item.subtitle ? item.title : ""}
        {item.location && item.subtitle ? ` · ${item.location}` : (item.location ?? "")}
       </p>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-xs tabular-nums text-neutral-500 dark:text-neutral-400 whitespace-nowrap shrink-0">
       {item.startDate && (
        <span>
         {item.startDate} – {item.endDate ?? "Present"}
        </span>
       )}
      </div>

      <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-data-[state=open]:rotate-90" />
     </AccordionTrigger>

     {item.description && (
      <AccordionContent className="ml-11 md:ml-13">
       <div className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
        {item.description}
       </div>
      </AccordionContent>
     )}

     {item.startDate && (
      <div className="sm:hidden ml-11 md:ml-13 -mt-2 mb-2 text-xs text-neutral-500 dark:text-neutral-400">
       {item.startDate} – {item.endDate ?? "Present"}
      </div>
     )}
    </AccordionItem>
   ))}
  </Accordion>
 );
}
