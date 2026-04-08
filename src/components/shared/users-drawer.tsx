"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { UnsavedChangesDialog } from "./unsaved-changes-dialog";
import { useConfirmClose } from "@/hooks/use-confirm-close";

interface UserItem {
 id: string;
 email: string;
 name: string;
}

interface UsersDrawerProps {
 open: boolean;
 onClose: () => void;
}

export function UsersDrawer({ open, onClose }: UsersDrawerProps) {
 const { markDirty, resetDirty, confirmClose, showConfirm, cancelClose, forceClose } =
  useConfirmClose(onClose);
 const [currentUserId, setCurrentUserId] = useState<string | null>(null);
 const [users, setUsers] = useState<UserItem[]>([]);
 const [loading, setLoading] = useState(false);
 const [adding, setAdding] = useState(false);
 const [email, setEmail] = useState("");
 const [name, setName] = useState("");
 const [password, setPassword] = useState("");
 const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

 useEffect(() => {
  if (!open) {
   setUsers([]);
   setCurrentUserId(null);
   return;
  }

  setLoading(true);

  apiFetch<{ users: UserItem[]; currentUserId: string | null }>("/api/users")
   .then((data) => {
    setUsers(data.users);
    setCurrentUserId(data.currentUserId);
   })
   .catch((err) => {
    toast.error(err instanceof Error ? err.message : "Failed to load users.");
   })
   .finally(() => setLoading(false));
 }, [open]);

 async function handleAdd(e: React.FormEvent) {
  e.preventDefault();
  setAdding(true);
  try {
   const user = await apiFetch<UserItem>("/api/users", {
    method: "POST",
    body: JSON.stringify({
     email,
     name,
     ...(password ? { password } : {}),
    }),
   });
   setUsers((prev) => [user, ...prev]);
   setEmail("");
   setName("");
   setPassword("");
   resetDirty();
   toast.success("User added!");
  } catch (err) {
   toast.error(err instanceof Error ? err.message : "Failed to add user.");
  } finally {
   setAdding(false);
  }
 }

 async function handleDelete() {
  if (!deleteUserId) return;
  try {
   await apiFetch(`/api/users?id=${encodeURIComponent(deleteUserId)}`, { method: "DELETE" });
   setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
   toast.success("User removed.");
  } catch (err) {
   toast.error(err instanceof Error ? err.message : "Delete failed.");
  } finally {
   setDeleteUserId(null);
  }
 }

 return (
  <Sheet open={open} onOpenChange={(v) => !v && confirmClose()}>
   <SheetContent className="w-full sm:max-w-lg! p-0 flex flex-col">
    <SheetHeader className="px-6 pt-6 pb-4">
     <SheetTitle>Manage Users</SheetTitle>
    </SheetHeader>

    <ScrollArea className="flex-1 min-h-0 px-6">
     <div className="space-y-6 pb-6">
      {/* Add user form */}
      <form
       onSubmit={handleAdd}
       className="space-y-3 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4"
      >
       <p className="text-sm font-medium">Add a new user</p>
       <div className="space-y-1.5">
        <Label htmlFor="new-name">Name</Label>
        <Input
         id="new-name"
         value={name}
         onChange={(e) => {
          markDirty();
          setName(e.target.value);
         }}
         placeholder="Jane Doe"
         required
        />
       </div>
       <div className="space-y-1.5">
        <Label htmlFor="new-email">Email</Label>
        <Input
         id="new-email"
         type="email"
         value={email}
         onChange={(e) => {
          markDirty();
          setEmail(e.target.value);
         }}
         placeholder="jane@example.com"
         required
        />
       </div>
       <div className="space-y-1.5">
        <Label htmlFor="new-password">Password (optional)</Label>
        <Input
         id="new-password"
         type="password"
         value={password}
         onChange={(e) => {
          markDirty();
          setPassword(e.target.value);
         }}
         placeholder="Leave blank for SSO-only"
         minLength={6}
        />
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
         If empty, the user can only sign in via Google or GitHub.
        </p>
       </div>
       <Button type="submit" size="sm" disabled={adding}>
        {adding ? "Adding..." : "Add User"}
       </Button>
      </form>

      {/* Users list */}
      <div className="space-y-1">
       <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
        {loading ? "Loading..." : `${users.length} user${users.length !== 1 ? "s" : ""}`}
       </p>
       <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
        {users.map((user) => (
         <div key={user.id} className="flex items-center justify-between py-3 gap-3">
          <div className="min-w-0">
           <p className="text-sm font-medium truncate">{user.name}</p>
           <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
          </div>
          {user.id !== currentUserId && (
           <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove ${user.name}`}
            className="shrink-0 text-neutral-400 hover:text-red-500"
            onClick={() => setDeleteUserId(user.id)}
           >
            <Trash2 className="size-4" />
           </Button>
          )}
         </div>
        ))}
       </div>
      </div>
     </div>
    </ScrollArea>
   </SheetContent>
   <UnsavedChangesDialog open={showConfirm} onConfirm={forceClose} onCancel={cancelClose} />
   <ConfirmDeleteDialog
    open={!!deleteUserId}
    title="Remove user?"
    description="This user will no longer be able to sign in."
    onConfirm={handleDelete}
    onCancel={() => setDeleteUserId(null)}
   />
  </Sheet>
 );
}
