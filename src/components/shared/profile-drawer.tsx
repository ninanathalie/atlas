"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";
import { useConfirmClose } from "@/hooks/use-confirm-close";
import { apiFetch } from "@/lib/api-client";

type Profile = {
 name: string;
 title: string | null;
 bio: string | null;
 profileImage: string | null;
 socialLinks: Record<string, string> | null;
};

const socialPlatforms = [
 { key: "github", label: "GitHub", placeholder: "https://github.com/..." },
 { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
 { key: "twitter", label: "X / Twitter", placeholder: "https://x.com/..." },
] as const;

interface ProfileDrawerProps {
 open: boolean;
 onClose: () => void;
}

export function ProfileDrawer({ open, onClose }: ProfileDrawerProps) {
 const router = useRouter();
 const { markDirty, resetDirty, confirmClose, showConfirm, cancelClose, forceClose } =
  useConfirmClose(onClose);
 const [profile, setProfile] = useState<Profile | null>(null);
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
  fetch("/api/profile", { signal: controller.signal })
   .then((r) => {
    if (!r.ok) throw new Error();
    return r.json();
   })
   .then((p: Profile) => {
    setProfile(p);
    setLoaded(true);
   })
   .catch((err) => {
    if (err instanceof DOMException && err.name === "AbortError") return;
    setLoadError(true);
    toast.error("Failed to load profile.");
   });

  return () => {
   controller.abort();
  };
 }, [open, loaded]);

 function setP<K extends keyof Profile>(key: K, value: Profile[K]) {
  markDirty();
  setProfile((prev) => (prev ? { ...prev, [key]: value } : prev));
 }

 function setSocial(key: string, value: string) {
  markDirty();
  setProfile((prev) => {
   if (!prev) return prev;
   return { ...prev, socialLinks: { ...(prev.socialLinks ?? {}), [key]: value } };
  });
 }

 async function handleSave() {
  if (!profile) return;
  setSaving(true);
  try {
   await apiFetch("/api/profile", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profile),
   });
   toast.success("Profile saved!");
   resetDirty();
   router.refresh();
   onClose();
  } catch (err) {
   toast.error(err instanceof Error ? err.message : "Save failed.");
  } finally {
   setSaving(false);
  }
 }

 return (
  <Sheet open={open} onOpenChange={(v) => !v && confirmClose()}>
   <SheetContent className="w-full sm:max-w-lg! p-0 flex flex-col">
    <SheetHeader className="px-6 pt-6 pb-4">
     <SheetTitle>Edit Profile</SheetTitle>
    </SheetHeader>

    <ScrollArea className="flex-1 min-h-0 px-6">
     {loadError ? (
      <p className="text-sm text-red-500 py-4">
       Failed to load profile. Please close and try again.
      </p>
     ) : (
      <div className="space-y-5 pb-6">
       <div className="space-y-1.5">
        <Label>Name</Label>
        <Input
         value={profile?.name ?? ""}
         onChange={(e) => setP("name", e.target.value)}
         placeholder="Your name"
        />
       </div>

       <div className="space-y-1.5">
        <Label>Title / Tagline</Label>
        <Input
         value={profile?.title ?? ""}
         onChange={(e) => setP("title", e.target.value)}
         placeholder="Frontend Developer"
        />
       </div>

       <div className="space-y-1.5">
        <Label>About / Bio</Label>
        <Textarea
         value={profile?.bio ?? ""}
         onChange={(e) => setP("bio", e.target.value)}
         rows={4}
         placeholder="Write a short bio..."
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
         Plain text. Shown in the About section on the homepage.
        </p>
       </div>

       <div className="space-y-1.5">
        <Label>Profile Image URL</Label>
        <Input
         value={profile?.profileImage ?? ""}
         onChange={(e) => setP("profileImage", e.target.value || null)}
         placeholder="https://example.com/photo.jpg"
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
         Direct URL to your profile image.
        </p>
       </div>

       <div className="pt-2">
        <p className="text-sm font-medium mb-3">Social Links</p>
        <div className="space-y-3">
         {socialPlatforms.map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-1.5">
           <Label>{label}</Label>
           <Input
            value={profile?.socialLinks?.[key] ?? ""}
            onChange={(e) => setSocial(key, e.target.value)}
            placeholder={placeholder}
           />
          </div>
         ))}
        </div>
       </div>
      </div>
     )}
    </ScrollArea>

    <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4 flex gap-3">
     <Button onClick={handleSave} disabled={saving || !profile}>
      {saving ? "Saving..." : "Save Profile"}
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
