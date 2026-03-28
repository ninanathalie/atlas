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
import { DOCK_TOOLTIP_CLASS, DOCK_ICON_CLASS } from "@/components/layout/dock-styles";

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

export function DockNav({ socialLinks, hasActiveCV, isAdmin, pageVisibility }: DockNavProps) {
 const { resolvedTheme, setTheme } = useTheme();

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
         <DockIcon className={DOCK_ICON_CLASS}>
          <item.icon className="size-full" />
         </DockIcon>
        </Link>
       </TooltipTrigger>
       <TooltipContent side="bottom" sideOffset={8} className={DOCK_TOOLTIP_CLASS}>
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
           <DockIcon className={DOCK_ICON_CLASS}>
            <item.icon className="size-full" />
           </DockIcon>
          </a>
         </TooltipTrigger>
         <TooltipContent side="bottom" sideOffset={8} className={DOCK_TOOLTIP_CLASS}>
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
      <TooltipTrigger
       onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
       aria-label="Toggle theme"
      >
       <DockIcon className={DOCK_ICON_CLASS}>
        {resolvedTheme === "dark" ? <Sun className="size-full" /> : <Moon className="size-full" />}
       </DockIcon>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8} className={DOCK_TOOLTIP_CLASS}>
       <p>Theme</p>
      </TooltipContent>
     </Tooltip>

     {isAdmin && <AdminDockItems />}
    </Dock>
   </div>
  </TooltipProvider>
 );
}
