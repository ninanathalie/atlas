import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-utils";
import { projectSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET() {
 try {
  const projects = await prisma.project.findMany({
   orderBy: [{ featured: "desc" }, { order: "asc" }],
  });
  return NextResponse.json(projects);
 } catch {
  return jsonError("Failed to fetch projects", 500);
 }
}

export async function POST(request: Request) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) return jsonError("Validation failed", 400);

  const existing = await prisma.project.findUnique({
   where: { slug: parsed.data.slug },
  });
  if (existing) return jsonError("Slug already exists", 409);

  const project = await prisma.project.create({ data: parsed.data });

  revalidatePath("/");
  revalidatePath("/projects");
  return NextResponse.json(project, { status: 201 });
 } catch {
  return jsonError("Failed to create project", 500);
 }
}
