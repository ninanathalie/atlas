import { prisma } from "@/lib/prisma";
import { ProjectsSection } from "@/components/section/projects-section";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
 const settings = await prisma.siteSettings.findFirst({
  select: { siteTitle: true },
 });
 return {
  title: `Projects — ${settings?.siteTitle ?? "Portfolio"}`,
  description: "Browse all projects",
 };
}

export default async function ProjectsPage() {
 const projects = await prisma.project.findMany({
  orderBy: [{ featured: "desc" }, { order: "asc" }],
 });

 return (
  <main className="min-h-dvh flex flex-col gap-8 max-w-2xl mx-auto px-6 w-full py-16 md:py-24">
   <div className="flex items-center gap-3">
    <Link
     href="/"
     className="inline-flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
    >
     <ArrowLeft className="h-4 w-4" />
     Back
    </Link>
   </div>

   <div>
    <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
     A collection of things I&apos;ve built.
    </p>
   </div>

   {projects.length > 0 ? (
    <ProjectsSection items={projects} showAll />
   ) : (
    <p className="text-neutral-500 dark:text-neutral-400">No projects yet.</p>
   )}
  </main>
 );
}
