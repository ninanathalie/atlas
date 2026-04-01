import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
 params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
 const { slug } = await params;
 const post = await prisma.blogPost.findUnique({
  where: { slug },
  select: { title: true, excerpt: true },
 });

 if (!post) return { title: "Post not found" };

 return {
  title: post.title,
  description: post.excerpt ?? undefined,
 };
}

function formatDate(date: Date): string {
 return new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
 }).format(date);
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
 const { slug } = await params;

 const post = await prisma.blogPost.findUnique({
  where: { slug },
  select: {
   id: true,
   title: true,
   slug: true,
   content: true,
   contentHtml: true,
   excerpt: true,
   category: true,
   tags: true,
   publishedAt: true,
   readTimeMin: true,
  },
 });

 if (!post || post.publishedAt === null) return notFound();

 return (
  <main className="min-h-dvh flex flex-col gap-8 max-w-2xl mx-auto px-6 w-full py-16 md:py-24">
   <div className="flex items-center gap-3">
    <Link
     href="/blog"
     className="inline-flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
    >
     <ArrowLeft className="h-4 w-4" />
     Back to blog
    </Link>
   </div>

   <article className="flex flex-col gap-6">
    <header className="flex flex-col gap-3">
     <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
      {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
      {post.readTimeMin && <span>· {post.readTimeMin} min read</span>}
     </div>

     <h1 className="text-2xl font-bold tracking-tight">{post.title}</h1>

     {post.excerpt && (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{post.excerpt}</p>
     )}

     <div className="flex flex-wrap gap-2">
      {post.category && (
       <Badge
        variant="secondary"
        className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
       >
        {post.category}
       </Badge>
      )}
      {post.tags.map((tag, index) => (
       <Badge
        key={`${tag}-${index}`}
        variant="secondary"
        className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
       >
        {tag}
       </Badge>
      ))}
     </div>
    </header>

    <div className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
     {post.contentHtml ? (
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
     ) : (
      post.content
     )}
    </div>
   </article>
  </main>
 );
}
