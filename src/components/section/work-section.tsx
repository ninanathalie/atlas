import { Badge } from "@/components/ui/badge";

interface WorkItem {
 id: string;
 title: string;
 subtitle?: string | null;
 description?: string | null;
 skills?: string[] | null;
 logoUrl?: string | null;
 location?: string | null;
 startDate?: string | null;
 endDate?: string | null;
}

interface WorkSectionProps {
 items: WorkItem[];
}

export function WorkSection({ items }: WorkSectionProps) {
 if (items.length === 0) return null;

 return (
  <ul className="flex flex-col gap-6">
   {items.map((item) => (
    <li key={item.id} className="flex flex-col gap-1.5">
     <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-2">
      <div className="min-w-0">
       <p className="text-sm font-medium leading-tight">{item.subtitle ?? item.title}</p>
       <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
        {item.subtitle ? item.title : ""}
        {item.location && item.subtitle ? ` · ${item.location}` : (item.location ?? "")}
       </p>
      </div>

      {item.startDate && (
       <span className="text-xs tabular-nums text-neutral-500 dark:text-neutral-400 whitespace-nowrap shrink-0">
        {item.startDate} – {item.endDate ?? "Present"}
       </span>
      )}
     </div>

     {item.description && (
      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 whitespace-pre-line">
       {item.description}
      </p>
     )}

     {item.skills && item.skills.length > 0 && (
      <ul className="flex flex-wrap gap-1.5 mt-1">
       {item.skills.map((skill) => (
        <li key={skill}>
         <Badge variant="secondary" className="font-normal">
          {skill}
         </Badge>
        </li>
       ))}
      </ul>
     )}
    </li>
   ))}
  </ul>
 );
}
