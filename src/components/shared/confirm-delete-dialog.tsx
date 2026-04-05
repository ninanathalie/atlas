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

interface ConfirmDeleteDialogProps {
 open: boolean;
 title?: string;
 description?: string;
 onConfirm: () => void;
 onCancel: () => void;
}

export function ConfirmDeleteDialog({
 open,
 title = "Are you sure?",
 description = "This action cannot be undone.",
 onConfirm,
 onCancel,
}: ConfirmDeleteDialogProps) {
 return (
  <AlertDialog open={open} onOpenChange={(v) => !v && onCancel()}>
   <AlertDialogContent>
    <AlertDialogHeader>
     <AlertDialogTitle>{title}</AlertDialogTitle>
     <AlertDialogDescription>{description}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
     <AlertDialogCancel>Cancel</AlertDialogCancel>
     <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
    </AlertDialogFooter>
   </AlertDialogContent>
  </AlertDialog>
 );
}
