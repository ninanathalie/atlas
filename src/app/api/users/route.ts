import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, isNotFoundError } from "@/lib/api-utils";
import { createUserSchema } from "@/lib/validations";

export async function GET() {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const users = await prisma.user.findMany({
   select: { id: true, name: true, email: true, createdAt: true },
   orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(users);
 } catch {
  return jsonError("Failed to fetch users", 500);
 }
}

export async function POST(request: Request) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const parsed = createUserSchema.safeParse(body);
  if (!parsed.success) return jsonError("Validation failed", 400);

  const existing = await prisma.user.findUnique({
   where: { email: parsed.data.email },
  });
  if (existing) return jsonError("Email already exists", 409);

  let passwordHash: string | undefined;
  if (parsed.data.password) {
   const bcrypt = await import("bcryptjs");
   passwordHash = await bcrypt.hash(parsed.data.password, 12);
  }

  const user = await prisma.user.create({
   data: {
    name: parsed.data.name,
    email: parsed.data.email,
    passwordHash,
   },
   select: { id: true, name: true, email: true, createdAt: true },
  });

  return NextResponse.json(user, { status: 201 });
 } catch {
  return jsonError("Failed to create user", 500);
 }
}

export async function DELETE(request: NextRequest) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) return jsonError("ID is required", 400);

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ success: true });
 } catch (e) {
  if (isNotFoundError(e)) return jsonError("User not found", 404);
  return jsonError("Failed to delete user", 500);
 }
}
