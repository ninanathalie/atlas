"use client";

import { FlickeringGrid } from "@/components/shared/flickering-grid";

export function MaintenanceScreen() {
 return (
  <div className="relative flex min-h-screen items-center justify-center bg-neutral-950">
   <div className="absolute inset-0 pointer-events-none">
    <FlickeringGrid
     className="h-full w-full"
     squareSize={3}
     gridGap={7}
     style={{
      maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, black 100%)",
      WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, black 100%)",
     }}
    />
   </div>
   <div className="relative z-10 text-center">
    <h1 className="text-4xl font-bold text-white">Under Maintenance</h1>
    <p className="mt-2 text-neutral-400">We&apos;ll be back shortly.</p>
   </div>
  </div>
 );
}
