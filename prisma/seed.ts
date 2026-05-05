import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

// Load .env before using process.env
config({ path: resolve(__dirname, "../.env") });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
 throw new Error("DATABASE_URL is not set. Check your .env file.");
}

const adapter = new PrismaNeon({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });

// Load seed data from local JSON (gitignored)
const dataPath = resolve(__dirname, "seed-data.json");
const data = JSON.parse(readFileSync(dataPath, "utf-8"));

async function main() {
 console.log("Connecting to database...");

 // ── User ──
 const user = await prisma.user.upsert({
  where: { email: data.user.email },
  update: {},
  create: data.user,
 });
 console.log("User:", user.name);

 // ── CV Sections ──
 const sections = [
  ...data.experiences.map((e: Record<string, unknown>) => ({ ...e, type: "experience" })),
  ...data.skills.map((s: Record<string, unknown>) => ({ ...s, type: "skill" })),
  ...data.education.map((e: Record<string, unknown>) => ({ ...e, type: "education" })),
 ];

 await prisma.$transaction([
  prisma.cVSection.deleteMany(),
  prisma.cVSection.createMany({ data: sections }),
 ]);
 console.log(
  "Seeded:",
  data.experiences.length,
  "experiences,",
  data.skills.length,
  "skills,",
  data.education.length,
  "education"
 );

 // ── Projects ──
 if (data.projects) {
  if (data.projects.length > 0) {
   await prisma.$transaction([
    prisma.project.deleteMany(),
    prisma.project.createMany({ data: data.projects }),
   ]);
   console.log("Seeded:", data.projects.length, "projects");
  } else {
   await prisma.project.deleteMany();
   console.log("Seeded: 0 projects (existing projects cleared)");
  }
 }

 // ── Blog Posts ──
 if (data.blogs) {
  if (data.blogs.length > 0) {
   const blogs = data.blogs.map((b: Record<string, unknown>) => ({
    ...b,
    publishedAt: b.publishedAt ? new Date(b.publishedAt as string) : null,
    scheduledAt: b.scheduledAt ? new Date(b.scheduledAt as string) : null,
   }));
   await prisma.$transaction([
    prisma.blogPost.deleteMany(),
    prisma.blogPost.createMany({ data: blogs }),
   ]);
   console.log("Seeded:", data.blogs.length, "blog posts");
  } else {
   await prisma.blogPost.deleteMany();
   console.log("Seeded: 0 blog posts (existing posts cleared)");
  }
 }

 // ── Site Settings ──
 const existing = await prisma.siteSettings.findFirst();
 if (!existing) {
  await prisma.siteSettings.create({ data: data.siteSettings });
  console.log("Site settings created.");
 } else {
  await prisma.siteSettings.update({
   where: { id: existing.id },
   data: data.siteSettings,
  });
  console.log("Site settings updated.");
 }
}

main()
 .catch((e) => {
  console.error(e);
  process.exit(1);
 })
 .finally(() => prisma.$disconnect());
