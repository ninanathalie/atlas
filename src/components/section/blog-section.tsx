import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface BlogPostItem {
 id: string;
 title: string;
 slug: string;
 excerpt?: string | null;
 category?: string | null;
 publishedAt?: Date | null;
 readTimeMin?: number | null;
}

interface BlogSectionProps {
 posts: BlogPostItem[];
}

function formatDate(date: Date): string {
 return new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
 }).format(date);
}

function BlogPostCard({ post }: { post: BlogPostItem }) {
 return (
  <Link
   href={`/blog/${post.slug}`}
   className="group flex flex-col gap-2 rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900"
  >
   <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
    {post.publishedAt && <time>{formatDate(post.publishedAt)}</time>}
    {post.readTimeMin && <span>· {post.readTimeMin} min read</span>}
   </div>

   <h3 className="text-sm font-semibold leading-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
    {post.title}
   </h3>

   {post.excerpt && (
    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{post.excerpt}</p>
   )}

   {post.category && (
    <Badge
     variant="secondary"
     className="w-fit text-[10px] px-1.5 py-0 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700"
    >
     {post.category}
    </Badge>
   )}
  </Link>
 );
}

export function BlogSection({ posts }: BlogSectionProps) {
 if (posts.length === 0) return null;

 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
   {posts.map((post) => (
    <BlogPostCard key={post.id} post={post} />
   ))}
  </div>
 );
}
