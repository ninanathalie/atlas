import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/section/hero-section";
import { WorkSection } from "@/components/section/work-section";
import { SkillsSection } from "@/components/section/skills-section";
import { EducationSection } from "@/components/section/education-section";
import { ProjectsSection } from "@/components/section/projects-section";
import Link from "next/link";
import {
 ExperienceEditButton,
 SkillEditButton,
 EducationEditButton,
} from "@/components/shared/homepage-edit-buttons";
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
 const [user, activeCV, cvSections, projects] = await Promise.all([
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
  prisma.cVSection.findMany({
   orderBy: [{ type: "asc" }, { order: "asc" }],
  }),
  prisma.project.findMany({
   orderBy: [{ featured: "desc" }, { order: "asc" }],
  }),
 ]);

 const experienceItems = cvSections.filter((s) => s.type === "experience");
 const skillItems = cvSections.filter((s) => s.type === "skill");
 const educationItems = cvSections.filter((s) => s.type === "education");

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

   {experienceItems.length > 0 && (
    <section id="work" className="group">
     <div className="flex min-h-0 flex-col gap-y-4">
      <div className="flex items-center gap-2">
       <h2 className="text-xl font-bold">Work Experience</h2>
       <ExperienceEditButton />
      </div>
      <WorkSection items={experienceItems} />
     </div>
    </section>
   )}

   {skillItems.length > 0 && (
    <section id="skills" className="group">
     <div className="flex min-h-0 flex-col gap-y-4">
      <div className="flex items-center gap-2">
       <h2 className="text-xl font-bold">Skills</h2>
       <SkillEditButton />
      </div>
      <SkillsSection items={skillItems} />
     </div>
    </section>
   )}

   {educationItems.length > 0 && (
    <section id="education" className="group">
     <div className="flex min-h-0 flex-col gap-y-4">
      <div className="flex items-center gap-2">
       <h2 className="text-xl font-bold">Education</h2>
       <EducationEditButton />
      </div>
      <EducationSection items={educationItems} />
     </div>
    </section>
   )}

   {projects.length > 0 && (
    <section id="projects" className="group">
     <div className="flex min-h-0 flex-col gap-y-4">
      <div className="flex items-center justify-between">
       <h2 className="text-xl font-bold">Projects</h2>
       {projects.length > 4 && (
        <Link
         href="/projects"
         className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
         View all →
        </Link>
       )}
      </div>
      <ProjectsSection items={projects} />
     </div>
    </section>
   )}
  </main>
 );
}
