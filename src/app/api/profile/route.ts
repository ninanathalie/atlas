import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-utils";
import { profileUpdateSchema } from "@/lib/validations";

export async function GET() {
 try {
  const user = await prisma.user.findFirst({
   select: {
    id: true,
    name: true,
    email: true,
    title: true,
    bio: true,
    profileImage: true,
    socialLinks: true,
   },
  });
  return NextResponse.json(user);
 } catch {
  return jsonError("Failed to fetch profile", 500);
 }
}

export async function PUT(request: Request) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const parsed = profileUpdateSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError("Validation failed", 400);

  const user = await prisma.user.findFirst();
  if (!user) return jsonError("User not found", 404);

  const updated = await prisma.user.update({
   where: { id: user.id },
   data: parsed.data,
   select: {
    id: true,
    name: true,
    email: true,
    title: true,
    bio: true,
    profileImage: true,
    socialLinks: true,
   },
  });

  return NextResponse.json(updated);
 } catch {
  return jsonError("Failed to update profile", 500);
 }
}
