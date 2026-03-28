import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/section/hero-section";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
 const settings = await prisma.siteSettings.findFirst({
  select: { siteTitle: true, siteDescription: true },
 });
 return {
  title: settings?.siteTitle ?? "Portfolio",
  description: settings?.siteDescription ?? "Personal portfolio",
 };
}

export default async function HomePage() {
 const [user, activeCV] = await Promise.all([
  prisma.user.findFirst({
   orderBy: { createdAt: "asc" },
   select: {
    name: true,
    title: true,
    bio: true,
    profileImage: true,
    socialLinks: true,
   },
  }),
  prisma.cVDocument.findFirst({
   where: { isActive: true },
   select: { id: true },
  }),
 ]);

 if (!user) {
  return (
   <main className="min-h-dvh flex flex-col items-center justify-center max-w-2xl mx-auto px-6 w-full">
    <div className="space-y-4 text-center">
     <h1 className="text-3xl font-semibold tracking-tight">Site not configured yet</h1>
     <p className="text-neutral-500 dark:text-neutral-400">
      This portfolio has not been set up. Please sign in to the admin area and create your profile
      to make your site publicly visible.
     </p>
    </div>
   </main>
  );
 }

 const socialLinks = user.socialLinks as Record<string, string> | null;

 return (
  <main className="min-h-dvh flex flex-col gap-14 max-w-2xl mx-auto px-6 w-full py-16 md:py-24">
   <HeroSection
    name={user.name}
    title={user.title ?? "Developer"}
    bio={user.bio ?? ""}
    profileImage={user.profileImage}
    socialLinks={socialLinks}
    hasActiveCV={!!activeCV}
   />
  </main>
 );
}
