import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "@/components/shared/auth-provider";
import { DrawerStateProvider } from "@/components/shared/drawer-state-provider";
import { FlickeringGrid } from "@/components/shared/flickering-grid";
import { MaintenanceScreen } from "@/components/shared/maintenance-screen";
import { DockNav } from "@/components/layout/dock-nav";
import { GlobalDrawers } from "@/components/shared/global-drawers";
import { prisma } from "@/lib/prisma";
import { Toaster } from "sonner";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
 const [session, settings] = await Promise.all([
  getServerSession(authOptions),
  prisma.siteSettings.findFirst({
   select: { maintenanceMode: true, showBlog: true, showProjects: true },
  }),
 ]);

 // Single-owner portfolio — any authenticated user is the admin
 const isAdmin = !!session;
 const inMaintenance = !isAdmin && (settings?.maintenanceMode ?? false);

 if (inMaintenance) return <MaintenanceScreen />;

 // Only fetch dock data after maintenance check passes
 const [user, activeCV] = await Promise.all([
  prisma.user.findFirst({
   orderBy: { createdAt: "asc" },
   select: { socialLinks: true },
  }),
  prisma.cVDocument.findFirst({
   where: { isActive: true },
   select: { id: true },
  }),
 ]);

 const socialLinks = user?.socialLinks as Record<string, string> | null;

 return (
  <AuthProvider isAdmin={isAdmin}>
   <DrawerStateProvider>
    <div className="relative min-h-screen overflow-x-clip">
     {/* Flickering grid background — fades downward */}
     <div className="absolute inset-x-0 top-0 h-24 overflow-hidden z-0 pointer-events-none">
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

     {/* Floating dock navigation — top center */}
     <DockNav
      socialLinks={socialLinks}
      hasActiveCV={!!activeCV}
      isAdmin={isAdmin}
      pageVisibility={{
       showBlog: settings?.showBlog ?? true,
       showProjects: settings?.showProjects ?? true,
      }}
     />

     {/* Page content — offset for dock */}
     <div className="relative z-10 pt-20">{children}</div>

     {/* Admin drawers */}
     <GlobalDrawers />
     <Toaster position="bottom-right" />
    </div>
   </DrawerStateProvider>
  </AuthProvider>
 );
}
