import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, isNotFoundError } from "@/lib/api-utils";

export async function GET() {
 try {
  const documents = await prisma.cVDocument.findMany({
   orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(documents);
 } catch {
  return jsonError("Failed to fetch CV documents", 500);
 }
}

export async function POST(request: Request) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const { filename, url, publicId, fileSize } = body;

  if (!filename || !url || !publicId || !fileSize) {
   return jsonError("Missing required fields", 400);
  }

  const document = await prisma.cVDocument.create({
   data: { filename, url, publicId, fileSize },
  });

  return NextResponse.json(document, { status: 201 });
 } catch {
  return jsonError("Failed to create CV document", 500);
 }
}

export async function PATCH(request: NextRequest) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return jsonError("ID is required", 400);

  // Deactivate all, then activate the selected one
  await prisma.$transaction([
   prisma.cVDocument.updateMany({ data: { isActive: false } }),
   prisma.cVDocument.update({
    where: { id },
    data: { isActive: true },
   }),
  ]);

  return NextResponse.json({ success: true });
 } catch (e) {
  if (isNotFoundError(e)) return jsonError("CV document not found", 404);
  return jsonError("Failed to toggle CV document status", 500);
 }
}

export async function DELETE(request: NextRequest) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return jsonError("ID is required", 400);

  await prisma.cVDocument.delete({ where: { id } });

  return NextResponse.json({ success: true });
 } catch (e) {
  if (isNotFoundError(e)) return jsonError("CV document not found", 404);
  return jsonError("Failed to delete CV document", 500);
 }
}
