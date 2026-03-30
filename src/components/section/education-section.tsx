import Image from "next/image";

interface EducationItem {
 id: string;
 title: string;
 subtitle?: string | null;
 logoUrl?: string | null;
 startDate?: string | null;
 endDate?: string | null;
}

interface EducationSectionProps {
 items: EducationItem[];
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

export function EducationSection({ items }: EducationSectionProps) {
 if (items.length === 0) return null;

 return (
  <div className="flex flex-col gap-2">
   {items.map((item) => (
    <div key={item.id} className="flex items-center gap-3 rounded-lg px-2 py-3">
     <LogoImage letter={item.title.charAt(0).toUpperCase()} logoUrl={item.logoUrl} />

     <div className="flex-1 min-w-0">
      <p className="text-sm font-medium leading-tight">{item.title}</p>
      {item.subtitle && (
       <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{item.subtitle}</p>
      )}
     </div>

     {item.startDate && (
      <div className="text-xs tabular-nums text-neutral-500 dark:text-neutral-400 whitespace-nowrap shrink-0">
       {item.startDate} – {item.endDate ?? "Present"}
      </div>
     )}
    </div>
   ))}
  </div>
 );
}
