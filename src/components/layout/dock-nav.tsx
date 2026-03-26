"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
 Home,
 FolderOpen,
 BookOpen,
 FileDown,
 Moon,
 Sun,
 GithubIcon,
 LinkedinIcon,
} from "lucide-react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { AdminDockItems } from "@/components/shared/admin-dock-items";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItem {
 href: string;
 label: string;
 icon: React.ComponentType<{ className?: string }>;
 external?: boolean;
}

interface SocialItem {
 href: string;
 label: string;
 icon: React.ComponentType<{ className?: string }>;
}

interface DockNavProps {
 socialLinks?: Record<string, string> | null;
 hasActiveCV?: boolean;
 isAdmin?: boolean;
 pageVisibility?: { showBlog: boolean; showProjects: boolean };
}

const tooltipClass =
 "rounded-xl bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900 px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]";

const dockIconClass =
 "rounded-3xl cursor-pointer size-full bg-white dark:bg-neutral-900 p-0 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 backdrop-blur-3xl border border-neutral-200 dark:border-neutral-800 transition-colors";

export function DockNav({ socialLinks, hasActiveCV, isAdmin, pageVisibility }: DockNavProps) {
 const { theme, setTheme } = useTheme();

 const allNavItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/projects", label: "Projects", icon: FolderOpen },
  { href: "/blog", label: "Blog", icon: BookOpen },
 ];

 if (hasActiveCV) {
  allNavItems.push({
   href: "/api/cv/pdf",
   label: "Download Resume",
   icon: FileDown,
   external: true,
  });
 }

 const navItems = isAdmin
  ? allNavItems
  : allNavItems.filter((item) => {
     if (item.href === "/projects") return pageVisibility?.showProjects ?? true;
     if (item.href === "/blog") return pageVisibility?.showBlog ?? true;
     return true;
    });

 const socialItems: SocialItem[] = [];
 if (socialLinks?.github) {
  socialItems.push({ href: socialLinks.github, label: "GitHub", icon: GithubIcon });
 }
 if (socialLinks?.linkedin) {
  socialItems.push({ href: socialLinks.linkedin, label: "LinkedIn", icon: LinkedinIcon });
 }

 return (
  <TooltipProvider delay={200}>
   <div className="pointer-events-none fixed inset-x-0 top-4 z-30">
    <Dock
     direction="down"
     magnification={70}
     distance={150}
     baseSize={40}
     className="z-50 pointer-events-auto relative h-14 p-2 w-fit mx-auto flex gap-2 border border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-neutral-900/5 dark:shadow-cyan-400/5"
    >
     {navItems.map((item) => (
      <Tooltip key={item.href}>
       <TooltipTrigger>
        <Link
         href={item.href}
         target={item.external ? "_blank" : undefined}
         rel={item.external ? "noopener noreferrer" : undefined}
        >
         <DockIcon className={dockIconClass}>
          <item.icon className="size-full" />
         </DockIcon>
        </Link>
       </TooltipTrigger>
       <TooltipContent side="bottom" sideOffset={8} className={tooltipClass}>
        <p>{item.label}</p>
       </TooltipContent>
      </Tooltip>
     ))}

     {socialItems.length > 0 && (
      <>
       <Separator
        orientation="vertical"
        className="h-2/3 m-auto w-px bg-neutral-200 dark:bg-neutral-800"
       />
       {socialItems.map((item) => (
        <Tooltip key={item.label}>
         <TooltipTrigger>
          <a href={item.href} target="_blank" rel="noopener noreferrer">
           <DockIcon className={dockIconClass}>
            <item.icon className="size-full" />
           </DockIcon>
          </a>
         </TooltipTrigger>
         <TooltipContent side="bottom" sideOffset={8} className={tooltipClass}>
          <p>{item.label}</p>
         </TooltipContent>
        </Tooltip>
       ))}
      </>
     )}

     <Separator
      orientation="vertical"
      className="h-2/3 m-auto w-px bg-neutral-200 dark:bg-neutral-800"
     />
     <Tooltip>
      <TooltipTrigger>
       <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
       >
        <DockIcon className={dockIconClass}>
         {theme === "dark" ? <Sun className="size-full" /> : <Moon className="size-full" />}
        </DockIcon>
       </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8} className={tooltipClass}>
       <p>Theme</p>
      </TooltipContent>
     </Tooltip>

     {isAdmin && <AdminDockItems />}
    </Dock>
   </div>
  </TooltipProvider>
 );
}
