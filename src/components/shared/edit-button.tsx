"use client";

import { Pencil } from "lucide-react";
import { AdminOnly } from "@/components/shared/admin-only";
import { Button } from "@/components/ui/button";

type EditButtonProps = {
 onClick: () => void;
 className?: string;
};

export function EditButton({ onClick, className }: EditButtonProps) {
 return (
  <AdminOnly>
   <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className={`h-8 w-8 rounded-full opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100 ${className ?? ""}`}
   >
    <Pencil className="h-4 w-4" />
   </Button>
  </AdminOnly>
 );
}
