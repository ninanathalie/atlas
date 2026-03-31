import { LogoImage } from "@/components/shared/logo-image";

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
