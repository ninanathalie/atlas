import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-utils";
import { settingsSchema } from "@/lib/validations";

export async function GET() {
 try {
  const settings = await prisma.siteSettings.findFirst();
  return NextResponse.json(settings ?? {});
 } catch {
  return jsonError("Failed to fetch settings", 500);
 }
}

export async function PUT(request: Request) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const parsed = settingsSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError("Validation failed", 400);

  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
   settings = await prisma.siteSettings.create({ data: parsed.data });
  } else {
   settings = await prisma.siteSettings.update({
    where: { id: settings.id },
    data: parsed.data,
   });
  }

  return NextResponse.json(settings);
 } catch {
  return jsonError("Failed to update settings", 500);
 }
}
