"use client";

import { Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { DockIcon } from "@/components/magicui/dock";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDrawerState } from "@/components/shared/drawer-state-provider";
import { DOCK_TOOLTIP_CLASS, DOCK_ICON_CLASS } from "@/components/layout/dock-styles";

export function AdminDockItems() {
 const { openDrawer } = useDrawerState();

 return (
  <>
   <Separator
    orientation="vertical"
    className="h-2/3 m-auto w-px bg-neutral-200 dark:bg-neutral-800"
   />

   <Tooltip>
    <TooltipTrigger onClick={() => openDrawer("settings")} aria-label="Settings">
     <DockIcon className={DOCK_ICON_CLASS}>
      <Settings className="size-full" />
     </DockIcon>
    </TooltipTrigger>
    <TooltipContent side="bottom" sideOffset={8} className={DOCK_TOOLTIP_CLASS}>
     <p>Settings</p>
    </TooltipContent>
   </Tooltip>

   <Tooltip>
    <TooltipTrigger onClick={() => signOut({ callbackUrl: "/" })} aria-label="Sign out">
     <DockIcon className={DOCK_ICON_CLASS}>
      <LogOut className="size-full" />
     </DockIcon>
    </TooltipTrigger>
    <TooltipContent side="bottom" sideOffset={8} className={DOCK_TOOLTIP_CLASS}>
     <p>Sign out</p>
    </TooltipContent>
   </Tooltip>
  </>
 );
}
