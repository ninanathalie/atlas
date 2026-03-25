import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError, isNotFoundError } from "@/lib/api-utils";
import { postSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
 const { id } = await params;
 try {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return jsonError("Post not found", 404);
  return NextResponse.json(post);
 } catch {
  return jsonError("Failed to fetch post", 500);
 }
}

export async function PUT(request: Request, { params }: Params) {
 const { id } = await params;
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const parsed = postSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError("Validation failed", 400);

  const data = { ...parsed.data } as Record<string, unknown>;
  if ("scheduledAt" in parsed.data) {
   data.scheduledAt =
    parsed.data.scheduledAt === null
     ? null
     : parsed.data.scheduledAt
       ? new Date(parsed.data.scheduledAt)
       : undefined;
  }

  const post = await prisma.blogPost.update({
   where: { id },
   data,
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return NextResponse.json(post);
 } catch (e) {
  if (isNotFoundError(e)) return jsonError("Post not found", 404);
  return jsonError("Failed to update post", 500);
 }
}

export async function DELETE(_request: Request, { params }: Params) {
 const { id } = await params;
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const post = await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  return NextResponse.json({ success: true });
 } catch (e) {
  if (isNotFoundError(e)) return jsonError("Post not found", 404);
  return jsonError("Failed to delete post", 500);
 }
}
