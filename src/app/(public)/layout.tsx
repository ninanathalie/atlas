import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "@/components/shared/auth-provider";
import { DrawerStateProvider } from "@/components/shared/drawer-state-provider";
import { CursorSpotlight } from "@/components/shared/cursor-spotlight";
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
     {/* Ambient pink/purple blobs + masked vignette — fixed to viewport so they stay centered */}
     <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="bg-[#fbe2e3] dark:bg-[#be185d]/10 absolute -top-32 right-44 h-125 w-125 rounded-full blur-[10rem] sm:w-275" />
      <div className="bg-[#dbd7fb] dark:bg-[#6d28d9]/10 absolute -top-24 -left-140 h-125 w-200 rounded-full blur-[10rem] sm:w-275 md:-left-132 lg:-left-112 xl:-left-60 2xl:-left-20" />
      <div
       className="absolute inset-0 bg-white dark:bg-neutral-950"
       style={{
        maskImage: "radial-gradient(ellipse at center, transparent 20%, black)",
        WebkitMaskImage: "radial-gradient(ellipse at center, transparent 20%, black)",
       }}
      />
     </div>

     {/* Static grid lines — full viewport, above vignette so they're not covered */}
     <div aria-hidden className="bg-grid-lines pointer-events-none fixed inset-0 z-1" />

     {/* Flickering grid background — fades downward */}
     <div className="absolute inset-x-0 top-0 h-24 overflow-hidden z-1 pointer-events-none">
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

     {/* Cursor-following spotlight — desktop only, respects reduced motion */}
     <CursorSpotlight />

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
