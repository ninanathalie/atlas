import { Badge } from "@/components/ui/badge";

interface SkillItem {
 id: string;
 title: string;
 subtitle?: string | null;
}

interface SkillsSectionProps {
 items: SkillItem[];
}

export function SkillsSection({ items }: SkillsSectionProps) {
 if (items.length === 0) return null;

 // Group skills by category (subtitle), defaulting to "Other"
 const grouped = items.reduce<Record<string, SkillItem[]>>((acc, item) => {
  const category = item.subtitle ?? "Other";
  if (!acc[category]) acc[category] = [];
  acc[category].push(item);
  return acc;
 }, {});

 return (
  <div className="flex flex-col gap-6">
   {Object.entries(grouped).map(([category, skills]) => (
    <div key={category}>
     <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">{category}</h3>
     <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
       <Badge
        key={skill.id}
        variant="secondary"
        className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700"
       >
        {skill.title}
       </Badge>
      ))}
     </div>
    </div>
   ))}
  </div>
 );
}
