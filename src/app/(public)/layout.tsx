import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "@/components/shared/auth-provider";
import { DrawerStateProvider } from "@/components/shared/drawer-state-provider";
import { FlickeringGrid } from "@/components/shared/flickering-grid";
import { MaintenanceScreen } from "@/components/shared/maintenance-screen";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
 const [session, settings] = await Promise.all([
  getServerSession(authOptions),
  prisma.siteSettings.findFirst(),
 ]);

 // Single-owner portfolio — any authenticated user is the admin
 const isAdmin = !!session;
 const inMaintenance = !isAdmin && (settings?.maintenanceMode ?? false);

 if (inMaintenance) return <MaintenanceScreen />;

 return (
  <AuthProvider isAdmin={isAdmin}>
   <DrawerStateProvider>
    <div className="relative min-h-screen overflow-x-clip">
     {/* Flickering grid background — fades downward */}
     <div className="absolute inset-0 top-0 left-0 right-0 h-25 overflow-hidden z-0 pointer-events-none">
      <FlickeringGrid
       className="h-full w-full"
       squareSize={2}
       gridGap={2}
       style={{
        maskImage: "linear-gradient(to bottom, black, transparent)",
        WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
       }}
      />
     </div>
     <div className="relative z-10">{children}</div>
    </div>
   </DrawerStateProvider>
  </AuthProvider>
 );
}
