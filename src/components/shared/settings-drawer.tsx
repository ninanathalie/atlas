"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Newspaper, FolderOpen, FileText, Users, ChevronRight } from "lucide-react";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";
import { useConfirmClose } from "@/hooks/use-confirm-close";
import { useDrawerState, type GlobalDrawer } from "./drawer-state-provider";
import { apiFetch } from "@/lib/api-client";

interface SiteSettingsData {
 siteTitle?: string;
 siteDescription?: string;
 accentColor?: string;
 faviconUrl?: string;
 footerText?: string;
 maintenanceMode?: boolean;
 showBlog?: boolean;
 showProjects?: boolean;
}

const publicPages: {
 key: "showBlog" | "showProjects";
 label: string;
 description: string;
 icon: React.ComponentType<{ className?: string }>;
}[] = [
 { key: "showBlog", label: "Blog", description: "Articles and technical writing", icon: Newspaper },
 {
  key: "showProjects",
  label: "Projects",
  description: "Portfolio project showcase",
  icon: FolderOpen,
 },
];

const managementItems: {
 label: string;
 description: string;
 icon: React.ComponentType<{ className?: string }>;
 drawer: GlobalDrawer;
}[] = [
 {
  label: "Resume",
  description: "Upload and manage your CV",
  icon: FileText,
  drawer: "cv-documents",
 },
 {
  label: "Users",
  description: "Manage admin access",
  icon: Users,
  drawer: "users",
 },
];

interface SettingsDrawerProps {
 open: boolean;
 onClose: () => void;
}

export function SettingsDrawer({ open, onClose }: SettingsDrawerProps) {
 const router = useRouter();
 const { openDrawer } = useDrawerState();
 const { markDirty, resetDirty, confirmClose, showConfirm, cancelClose, forceClose } =
  useConfirmClose(onClose);
 const [settings, setSettings] = useState<SiteSettingsData>({});
 const [saving, setSaving] = useState(false);
 const [loaded, setLoaded] = useState(false);
 const [loadError, setLoadError] = useState(false);

 useEffect(() => {
  if (!open) {
   setLoaded(false);
   setLoadError(false);
   return;
  }

  if (loaded) return;

  const controller = new AbortController();

  setLoadError(false);
  fetch("/api/settings", { signal: controller.signal })
   .then((r) => {
    if (!r.ok) throw new Error();
    return r.json();
   })
   .then((s) => {
    setSettings(s ?? {});
    setLoaded(true);
   })
   .catch((err) => {
    if (err instanceof DOMException && err.name === "AbortError") return;
    setLoadError(true);
    toast.error("Failed to load settings.");
   });

  return () => {
   controller.abort();
  };
 }, [open, loaded]);

 function set<K extends keyof SiteSettingsData>(key: K, value: SiteSettingsData[K]) {
  markDirty();
  setSettings((prev) => ({ ...prev, [key]: value }));
 }

 async function handleSave() {
  setSaving(true);
  try {
   await apiFetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(settings),
   });
   toast.success("Settings saved!");
   resetDirty();
   router.refresh();
   onClose();
  } catch (err) {
   toast.error(err instanceof Error ? err.message : "Save failed.");
  } finally {
   setSaving(false);
  }
 }

 const accentColor = settings.accentColor ?? "#D4A853";

 return (
  <Sheet open={open} onOpenChange={(v) => !v && confirmClose()}>
   <SheetContent className="w-full sm:max-w-lg! p-0 flex flex-col overflow-visible">
    <SheetHeader className="px-6 pt-6 pb-4">
     <SheetTitle>Site Settings</SheetTitle>
    </SheetHeader>

    <ScrollArea className="flex-1 min-h-0 px-6">
     {loadError && (
      <p className="text-sm text-red-500 py-4">
       Failed to load settings. Please close and try again.
      </p>
     )}
     <div className="space-y-6 pb-6">
      {/* Site info */}
      <div className="space-y-4">
       <div className="space-y-1.5">
        <Label>Site Title</Label>
        <Input
         value={settings.siteTitle ?? ""}
         onChange={(e) => set("siteTitle", e.target.value)}
        />
       </div>
       <div className="space-y-1.5">
        <Label>Meta Description</Label>
        <Textarea
         value={settings.siteDescription ?? ""}
         onChange={(e) => set("siteDescription", e.target.value)}
         rows={2}
        />
       </div>
       <div className="space-y-1.5">
        <Label>Footer Text</Label>
        <Input
         value={settings.footerText ?? ""}
         onChange={(e) => set("footerText", e.target.value)}
        />
       </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-1.5">
       <Label>Accent Color</Label>
       <div className="flex items-start gap-3">
        <div className="relative shrink-0">
         <input
          type="color"
          id="accent-color-picker"
          value={accentColor}
          onChange={(e) => set("accentColor", e.target.value)}
          className="sr-only"
         />
         <label
          htmlFor="accent-color-picker"
          className="block size-10 rounded-lg border-2 border-neutral-200 dark:border-neutral-700 shadow-sm cursor-pointer transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: accentColor }}
         />
        </div>
        <div className="flex-1 space-y-1.5">
         <Input
          value={accentColor}
          onChange={(e) => set("accentColor", e.target.value)}
          className="font-mono text-sm"
          maxLength={7}
          placeholder="#D4A853"
         />
         <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Used for highlights and interactive accents across the site.
         </p>
        </div>
       </div>
      </div>

      {/* Maintenance Mode */}
      <div className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3">
       <div>
        <p className="text-sm font-medium">Maintenance Mode</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
         Hides the site from all visitors
        </p>
       </div>
       <Switch
        checked={settings.maintenanceMode ?? false}
        onCheckedChange={(v) => set("maintenanceMode", v)}
       />
      </div>

      <Separator className="bg-neutral-200 dark:bg-neutral-800" />

      {/* Public Pages */}
      <div className="space-y-3">
       <div>
        <p className="text-sm font-semibold">Public Pages</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
         Toggle which sections visitors can access. You always see all pages as admin.
        </p>
       </div>
       {publicPages.map(({ key, label, description, icon: Icon }) => (
        <div
         key={key}
         className="flex items-center justify-between rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3"
        >
         <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
           <Icon className="size-4 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div>
           <p className="text-sm font-medium">{label}</p>
           <p className="text-xs text-neutral-500 dark:text-neutral-400">{description}</p>
          </div>
         </div>
         <Switch checked={settings[key] ?? true} onCheckedChange={(v) => set(key, v)} />
        </div>
       ))}
      </div>

      <Separator className="bg-neutral-200 dark:bg-neutral-800" />

      {/* Manage section */}
      <div className="space-y-3">
       <div>
        <p className="text-sm font-semibold">Manage</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
         Jump to other admin sections.
        </p>
       </div>
       {managementItems.map(({ label, description, icon: Icon, drawer }) => {
        const isAvailable = drawer === "settings";
        return (
         <button
          key={drawer}
          type="button"
          disabled={!isAvailable}
          className="flex w-full items-center gap-3 rounded-lg border border-neutral-200 dark:border-neutral-800 px-4 py-3 text-left cursor-pointer transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => openDrawer(drawer)}
         >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-neutral-800">
           <Icon className="size-4 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="flex-1 min-w-0">
           <p className="text-sm font-medium">{label}</p>
           <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug">
            {description}
           </p>
          </div>
          <ChevronRight className="size-4 text-neutral-500 dark:text-neutral-400 shrink-0" />
         </button>
        );
       })}
      </div>
     </div>
    </ScrollArea>

    <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 flex gap-3">
     <Button onClick={handleSave} disabled={saving}>
      {saving ? "Saving..." : "Save Settings"}
     </Button>
     <Button variant="outline" onClick={confirmClose}>
      Cancel
     </Button>
    </div>
   </SheetContent>
   <UnsavedChangesDialog open={showConfirm} onConfirm={forceClose} onCancel={cancelClose} />
  </Sheet>
 );
}
