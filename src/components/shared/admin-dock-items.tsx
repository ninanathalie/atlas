"use client";

import { Settings, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { DockIcon } from "@/components/magicui/dock";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDrawerState } from "@/components/shared/drawer-state-provider";

const tooltipClass =
 "rounded-xl bg-neutral-900 text-neutral-50 dark:bg-neutral-50 dark:text-neutral-900 px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]";

const dockIconClass =
 "rounded-3xl cursor-pointer size-full bg-white dark:bg-neutral-900 p-0 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 backdrop-blur-3xl border border-neutral-200 dark:border-neutral-800 transition-colors";

export function AdminDockItems() {
 const { openDrawer } = useDrawerState();

 return (
  <>
   <Separator
    orientation="vertical"
    className="h-2/3 m-auto w-px bg-neutral-200 dark:bg-neutral-800"
   />

   <Tooltip>
    <TooltipTrigger>
     <button type="button" onClick={() => openDrawer("settings")} aria-label="Settings">
      <DockIcon className={dockIconClass}>
       <Settings className="size-full" />
      </DockIcon>
     </button>
    </TooltipTrigger>
    <TooltipContent side="bottom" sideOffset={8} className={tooltipClass}>
     <p>Settings</p>
    </TooltipContent>
   </Tooltip>

   <Tooltip>
    <TooltipTrigger>
     <button type="button" onClick={() => signOut({ callbackUrl: "/" })} aria-label="Sign out">
      <DockIcon className={dockIconClass}>
       <LogOut className="size-full" />
      </DockIcon>
     </button>
    </TooltipTrigger>
    <TooltipContent side="bottom" sideOffset={8} className={tooltipClass}>
     <p>Sign out</p>
    </TooltipContent>
   </Tooltip>
  </>
 );
}
