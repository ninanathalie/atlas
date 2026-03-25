"use client";

import { useIsAdmin } from "@/components/shared/auth-provider";

export function AdminOnly({ children }: { children: React.ReactNode }) {
 const isAdmin = useIsAdmin();
 if (!isAdmin) return null;
 return <>{children}</>;
}
