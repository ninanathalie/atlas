"use client";

import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UnsavedChangesDialogProps {
 open: boolean;
 onConfirm: () => void;
 onCancel: () => void;
}

export function UnsavedChangesDialog({ open, onConfirm, onCancel }: UnsavedChangesDialogProps) {
 return (
  <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
   <AlertDialogContent>
    <AlertDialogHeader>
     <AlertDialogTitle>Unsaved changes</AlertDialogTitle>
     <AlertDialogDescription>
      You have unsaved changes. Are you sure you want to close without saving?
     </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
     <AlertDialogCancel onClick={onCancel}>Keep editing</AlertDialogCancel>
     <AlertDialogAction onClick={onConfirm}>Discard changes</AlertDialogAction>
    </AlertDialogFooter>
   </AlertDialogContent>
  </AlertDialog>
 );
}
