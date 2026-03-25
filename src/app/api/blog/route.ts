import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-utils";
import { postSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export async function GET(request: NextRequest) {
 try {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status") || "published";

  const posts = await prisma.blogPost.findMany({
   where: { status },
   orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json(posts);
 } catch {
  return jsonError("Failed to fetch posts", 500);
 }
}

export async function POST(request: Request) {
 const { error } = await requireAuth();
 if (error) return error;

 try {
  const body = await request.json();
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return jsonError("Validation failed", 400);

  const existing = await prisma.blogPost.findUnique({
   where: { slug: parsed.data.slug },
  });
  if (existing) return jsonError("Slug already exists", 409);

  const post = await prisma.blogPost.create({
   data: {
    ...parsed.data,
    publishedAt: parsed.data.status === "published" ? new Date() : null,
    scheduledAt: parsed.data.scheduledAt ? new Date(parsed.data.scheduledAt) : null,
   },
  });

  revalidatePath("/blog");
  return NextResponse.json(post, { status: 201 });
 } catch {
  return jsonError("Failed to create post", 500);
 }
}
