import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "@/components/shared/auth-provider";
import { DrawerStateProvider } from "@/components/shared/drawer-state-provider";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
 const session = await getServerSession(authOptions);
 // Single-owner portfolio — any authenticated user is the admin
 const isAdmin = !!session;

 return (
  <AuthProvider isAdmin={isAdmin}>
   <DrawerStateProvider>{children}</DrawerStateProvider>
  </AuthProvider>
 );
}
