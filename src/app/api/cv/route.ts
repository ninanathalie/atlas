import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, isNotFoundError } from "@/lib/api-utils";
import { cvSectionSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
 try {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type");

  const sections = await prisma.cVSection.findMany({
   where: type ? { type } : undefined,
   orderBy: [{ type: "asc" }, { order: "asc" }],
  });

  return NextResponse.json(sections);
 } catch {
  return jsonError("Failed to fetch CV sections", 500);
 }
}

export async function POST(request: Request) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const parsed = cvSectionSchema.safeParse(body);
  if (!parsed.success) return jsonError("Validation failed", 400);

  const section = await prisma.cVSection.create({ data: parsed.data });

  revalidatePath("/");
  return NextResponse.json(section, { status: 201 });
 } catch {
  return jsonError("Failed to create CV section", 500);
 }
}

export async function PUT(request: Request) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const { id, ...data } = body;
  if (!id) return jsonError("ID is required", 400);

  const parsed = cvSectionSchema.partial().safeParse(data);
  if (!parsed.success) return jsonError("Validation failed", 400);

  const section = await prisma.cVSection.update({
   where: { id },
   data: parsed.data,
  });

  revalidatePath("/");
  return NextResponse.json(section);
 } catch (e) {
  if (isNotFoundError(e)) return jsonError("CV section not found", 404);
  return jsonError("Failed to update CV section", 500);
 }
}

export async function DELETE(request: NextRequest) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return jsonError("ID is required", 400);

  await prisma.cVSection.delete({ where: { id } });

  revalidatePath("/");
  return NextResponse.json({ success: true });
 } catch (e) {
  if (isNotFoundError(e)) return jsonError("CV section not found", 404);
  return jsonError("Failed to delete CV section", 500);
 }
}
