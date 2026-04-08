"use client";

import { useDrawerState } from "./drawer-state-provider";
import { SettingsDrawer } from "./settings-drawer";
import { ProfileDrawer } from "./profile-drawer";
import { UsersDrawer } from "./users-drawer";
import { CVDocumentsDrawer } from "./cv-documents-drawer";

export function GlobalDrawers() {
 const { open, closeDrawer } = useDrawerState();

 return (
  <>
   <SettingsDrawer open={open === "settings"} onClose={closeDrawer} />
   <ProfileDrawer open={open === "profile"} onClose={closeDrawer} />
   <UsersDrawer open={open === "users"} onClose={closeDrawer} />
   <CVDocumentsDrawer open={open === "cv-documents"} onClose={closeDrawer} />
  </>
 );
}
