"use client";

import { useDrawerState } from "./drawer-state-provider";
import { SettingsDrawer } from "./settings-drawer";

export function GlobalDrawers() {
 const { open, closeDrawer } = useDrawerState();

 return (
  <>
   <SettingsDrawer open={open === "settings"} onClose={closeDrawer} />
   {/* Future drawers: profile, cv-experience, cv-education, cv-skill, cv-documents, users */}
  </>
 );
}
