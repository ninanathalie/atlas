import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-utils";
import { projectSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
 const { id } = await params;
 try {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return jsonError("Project not found", 404);
  return NextResponse.json(project);
 } catch {
  return jsonError("Failed to fetch project", 500);
 }
}

export async function PUT(request: Request, { params }: Params) {
 const { id } = await params;
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError("Validation failed", 400);

  const project = await prisma.project.update({
   where: { id },
   data: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/projects");
  return NextResponse.json(project);
 } catch {
  return jsonError("Failed to update project", 500);
 }
}

export async function DELETE(_request: Request, { params }: Params) {
 const { id } = await params;
 const { error } = await requireAuth();
 if (error) return error;

 try {
  await prisma.project.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/projects");
  return NextResponse.json({ success: true });
 } catch {
  return jsonError("Failed to delete project", 500);
 }
}
