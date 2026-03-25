"use client";

import { createContext, useContext, useState, useCallback } from "react";

export type GlobalDrawer =
 | "settings"
 | "profile"
 | "users"
 | "cv-experience"
 | "cv-education"
 | "cv-skill"
 | "cv-documents";

type DrawerStateContextType = {
 open: GlobalDrawer | null;
 openDrawer: (drawer: GlobalDrawer) => void;
 closeDrawer: () => void;
};

const DrawerStateContext = createContext<DrawerStateContextType>({
 open: null,
 openDrawer: () => {},
 closeDrawer: () => {},
});

export function useDrawerState() {
 return useContext(DrawerStateContext);
}

export function DrawerStateProvider({ children }: { children: React.ReactNode }) {
 const [open, setOpen] = useState<GlobalDrawer | null>(null);

 const openDrawer = useCallback((drawer: GlobalDrawer) => {
  setOpen(drawer);
 }, []);

 const closeDrawer = useCallback(() => {
  setOpen(null);
 }, []);

 return (
  <DrawerStateContext value={{ open, openDrawer, closeDrawer }}>{children}</DrawerStateContext>
 );
}
