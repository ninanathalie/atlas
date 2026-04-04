"use client";

import { useDrawerState } from "./drawer-state-provider";
import { SettingsDrawer } from "./settings-drawer";
import { ProfileDrawer } from "./profile-drawer";

export function GlobalDrawers() {
 const { open, closeDrawer } = useDrawerState();

 return (
  <>
   <SettingsDrawer open={open === "settings"} onClose={closeDrawer} />
   <ProfileDrawer open={open === "profile"} onClose={closeDrawer} />
   {/* Future drawers: cv-experience, cv-education, cv-skill, cv-documents, users */}
  </>
 );
}
