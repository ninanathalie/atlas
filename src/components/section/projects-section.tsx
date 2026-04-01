import Link from "next/link";
import Image from "next/image";
import { ExternalLink, GithubIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { isSafeUrl } from "@/lib/utils";

interface ProjectItem {
 id: string;
 title: string;
 slug: string;
 description?: string | null;
 techStack: string[];
 liveUrl?: string | null;
 repoUrl?: string | null;
 imageUrl?: string | null;
}

interface ProjectsSectionProps {
 items: ProjectItem[];
 showAll?: boolean;
}

function ProjectCard({ project }: { project: ProjectItem }) {
 return (
  <div className="group relative flex flex-col gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900">
   {project.imageUrl && (
    <div className="overflow-hidden rounded-md">
     <Image
      src={project.imageUrl}
      alt={project.title}
      width={600}
      height={340}
      className="w-full object-cover aspect-video"
     />
    </div>
   )}

   <div className="flex-1 space-y-2">
    <h3 className="text-sm font-semibold leading-tight">{project.title}</h3>
    {project.description && (
     <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">
      {project.description}
     </p>
    )}
   </div>

   {project.techStack.length > 0 && (
    <div className="flex flex-wrap gap-1">
     {project.techStack.map((tech, index) => (
      <Badge
       key={`${tech}-${index}`}
       variant="secondary"
       className="text-[10px] px-1.5 py-0 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
      >
       {tech}
      </Badge>
     ))}
    </div>
   )}

   <div className="flex items-center gap-3">
    {project.liveUrl && isSafeUrl(project.liveUrl) && (
     <Link
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
     >
      <ExternalLink className="h-3 w-3" />
      Live
     </Link>
    )}
    {project.repoUrl && isSafeUrl(project.repoUrl) && (
     <Link
      href={project.repoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
     >
      <GithubIcon className="h-3 w-3" />
      Repo
     </Link>
    )}
   </div>
  </div>
 );
}

export function ProjectsSection({ items, showAll = false }: ProjectsSectionProps) {
 if (items.length === 0) return null;

 const displayed = showAll ? items : items.slice(0, 4);

 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
   {displayed.map((project) => (
    <ProjectCard key={project.id} project={project} />
   ))}
  </div>
 );
}
