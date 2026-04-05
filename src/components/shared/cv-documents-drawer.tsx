"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Upload, Eye, Trash2, CheckCircle, Circle, FileText, Loader2 } from "lucide-react";
import { ConfirmDeleteDialog } from "./confirm-delete-dialog";
import { formatBytes } from "@/lib/utils";

interface CVDocument {
 id: string;
 filename: string;
 url: string;
 publicId: string;
 fileSize: number;
 isActive: boolean;
 createdAt: string;
}

function formatDate(date: string): string {
 return new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
 }).format(new Date(date));
}

interface CVDocumentsDrawerProps {
 open: boolean;
 onClose: () => void;
}

export function CVDocumentsDrawer({ open, onClose }: CVDocumentsDrawerProps) {
 const [documents, setDocuments] = useState<CVDocument[]>([]);
 const [loading, setLoading] = useState(false);
 const [uploading, setUploading] = useState(false);
 const [dragging, setDragging] = useState(false);
 const [toDelete, setToDelete] = useState<CVDocument | null>(null);
 const [activating, setActivating] = useState<string | null>(null);
 const [deleting, setDeleting] = useState<string | null>(null);
 const fileInputRef = useRef<HTMLInputElement>(null);

 const fetchDocuments = useCallback(async (signal?: AbortSignal) => {
  setLoading(true);
  try {
   const res = await fetch("/api/cv/documents", { signal });
   if (res.ok) setDocuments(await res.json());
  } catch (err) {
   if (err instanceof DOMException && err.name === "AbortError") return;
   toast.error("Failed to load documents.");
  } finally {
   setLoading(false);
  }
 }, []);

 useEffect(() => {
  if (!open) {
   setDocuments([]);
   return;
  }

  const controller = new AbortController();
  fetchDocuments(controller.signal);

  return () => {
   controller.abort();
  };
 }, [open, fetchDocuments]);

 async function handleUpload(file: File) {
  if (file.type !== "application/pdf") {
   toast.error("Only PDF files are accepted.");
   return;
  }
  setUploading(true);
  try {
   const formData = new FormData();
   formData.append("file", file);
   const res = await fetch("/api/cv/documents", { method: "POST", body: formData });
   if (!res.ok) throw new Error();
   toast.success("PDF uploaded successfully.");
   fetchDocuments();
  } catch {
   toast.error("Upload failed.");
  } finally {
   setUploading(false);
  }
 }

 async function handleToggleActive(doc: CVDocument) {
  setActivating(doc.id);
  try {
   const res = await fetch(`/api/cv/documents?id=${doc.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive: !doc.isActive }),
   });
   if (!res.ok) throw new Error();
   toast.success(doc.isActive ? "CV deactivated." : "CV set as active.");
   fetchDocuments();
  } catch {
   toast.error("Failed to update status.");
  } finally {
   setActivating(null);
  }
 }

 async function handleDelete(doc: CVDocument) {
  setDeleting(doc.id);
  try {
   const res = await fetch(`/api/cv/documents?id=${doc.id}`, { method: "DELETE" });
   if (!res.ok) throw new Error();
   toast.success("Document deleted.");
   setToDelete(null);
   fetchDocuments();
  } catch {
   toast.error("Delete failed.");
  } finally {
   setDeleting(null);
  }
 }

 function handleDrop(e: React.DragEvent) {
  e.preventDefault();
  setDragging(false);
  const file = e.dataTransfer.files[0];
  if (file) handleUpload(file);
 }

 const activeDoc = documents.find((d) => d.isActive);

 return (
  <>
   <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
    <SheetContent className="w-full sm:max-w-lg! p-0 flex flex-col">
     <SheetHeader className="px-6 pt-6 pb-4">
      <SheetTitle>Resume</SheetTitle>
     </SheetHeader>

     <ScrollArea className="flex-1 min-h-0 px-6">
      <div className="space-y-6 pb-6">
       {/* Active CV banner */}
       {activeDoc ? (
        <div className="flex items-center gap-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 px-4 py-3">
         <FileText className="size-4 shrink-0 text-neutral-600 dark:text-neutral-400" />
         <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{activeDoc.filename}</p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
           Active · visible to visitors
          </p>
         </div>
         <Badge className="text-xs shrink-0">Active</Badge>
        </div>
       ) : (
        <div className="flex items-center gap-3 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 px-4 py-3 text-neutral-500 dark:text-neutral-400">
         <FileText className="size-4 shrink-0" />
         <p className="text-sm">No active CV — download link is hidden from visitors.</p>
        </div>
       )}

       {/* Upload zone */}
       <div
        role="button"
        tabIndex={0}
        aria-label="Upload PDF"
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-colors ${
         dragging
          ? "border-neutral-900 dark:border-neutral-100 bg-neutral-50 dark:bg-neutral-900"
          : "border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
        onDragOver={(e) => {
         e.preventDefault();
         setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
       >
        {uploading ? (
         <>
          <Loader2 className="size-5 animate-spin text-neutral-500" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Uploading...</p>
         </>
        ) : (
         <>
          <Upload className="size-5 text-neutral-500 dark:text-neutral-400" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
           Drop a PDF here or{" "}
           <span className="text-neutral-900 dark:text-neutral-100 font-medium">
            click to browse
           </span>
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">PDF only</p>
         </>
        )}
        <input
         ref={fileInputRef}
         type="file"
         accept="application/pdf"
         className="sr-only"
         onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
          e.target.value = "";
         }}
        />
       </div>

       {/* Document list */}
       {loading ? (
        <div className="flex justify-center py-6">
         <Loader2 className="size-5 animate-spin text-neutral-500" />
        </div>
       ) : documents.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
         No documents uploaded yet.
        </p>
       ) : (
        <div className="space-y-1">
         <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-2">
          Versions ({documents.length})
         </p>
         {documents.map((doc) => (
          <div
           key={doc.id}
           className={`group flex items-start gap-3 rounded-lg border px-3 py-3 transition-colors ${
            doc.isActive
             ? "border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900"
             : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
           }`}
          >
           <FileText className="size-4 mt-0.5 shrink-0 text-neutral-500 dark:text-neutral-400" />

           <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
             <span className="text-sm font-medium truncate">{doc.filename}</span>
             {doc.isActive && <Badge className="text-[10px] px-1.5 py-0 shrink-0">Active</Badge>}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
             {formatBytes(doc.fileSize)} · {formatDate(doc.createdAt)}
            </p>
           </div>

           <div className="flex items-center gap-0.5 shrink-0">
            <Button
             variant="ghost"
             size="icon-xs"
             aria-label="Preview in new tab"
             onClick={() => window.open(doc.url, "_blank")}
            >
             <Eye className="size-3.5" />
            </Button>

            <Button
             variant="ghost"
             size="icon-xs"
             aria-label={doc.isActive ? "Deactivate" : "Set as active CV"}
             disabled={activating === doc.id}
             onClick={() => handleToggleActive(doc)}
            >
             {activating === doc.id ? (
              <Loader2 className="size-3.5 animate-spin" />
             ) : doc.isActive ? (
              <CheckCircle className="size-3.5 text-neutral-900 dark:text-neutral-100" />
             ) : (
              <Circle className="size-3.5" />
             )}
            </Button>

            <Button
             variant="ghost"
             size="icon-xs"
             aria-label={`Delete ${doc.filename}`}
             disabled={deleting === doc.id}
             className="hover:text-red-500"
             onClick={() => setToDelete(doc)}
            >
             {deleting === doc.id ? (
              <Loader2 className="size-3.5 animate-spin" />
             ) : (
              <Trash2 className="size-3.5" />
             )}
            </Button>
           </div>
          </div>
         ))}
        </div>
       )}

       <Separator className="bg-neutral-200 dark:bg-neutral-800" />
       <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
        Only one document can be active at a time. The active document is served when visitors click
        &quot;Download Resume&quot;. The dock link is hidden when no document is active.
       </p>
      </div>
     </ScrollArea>

     <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-4">
      <Button variant="outline" onClick={onClose}>
       Close
      </Button>
     </div>
    </SheetContent>
   </Sheet>

   <ConfirmDeleteDialog
    open={!!toDelete}
    title="Delete CV document?"
    description={`"${toDelete?.filename}" will be permanently deleted. This cannot be undone.`}
    onConfirm={() => toDelete && handleDelete(toDelete)}
    onCancel={() => setToDelete(null)}
   />
  </>
 );
}
