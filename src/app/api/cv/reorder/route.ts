import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-utils";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reorderSchema = z.array(
 z.object({
  id: z.string(),
  order: z.number().int(),
 })
);

export async function POST(request: Request) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const parsed = reorderSchema.safeParse(body);
  if (!parsed.success) return jsonError("Validation failed", 400);

  await prisma.$transaction(
   parsed.data.map((item) =>
    prisma.cVSection.update({
     where: { id: item.id },
     data: { order: item.order },
    })
   )
  );

  revalidatePath("/");
  return NextResponse.json({ success: true });
 } catch {
  return jsonError("Failed to reorder CV sections", 500);
 }
}
