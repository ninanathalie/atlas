import { z } from "zod";

export const profileUpdateSchema = z.object({
 name: z.string().min(1),
 title: z.string().optional(),
 bio: z.string().optional(),
 profileImage: z.string().optional(),
 socialLinks: z.record(z.string(), z.string()).optional(),
});

export const settingsSchema = z.object({
 siteTitle: z.string().min(1),
 siteDescription: z.string().optional(),
 accentColor: z.string().max(7).optional(),
 logoUrl: z.string().optional(),
 faviconUrl: z.string().optional(),
 footerText: z.string().optional(),
 maintenanceMode: z.boolean().optional(),
 showBlog: z.boolean().optional(),
 showProjects: z.boolean().optional(),
});

export const postSchema = z.object({
 title: z.string().min(1),
 slug: z.string().min(1),
 excerpt: z.string().optional(),
 content: z.string().min(1),
 contentHtml: z.string().optional(),
 coverImageUrl: z.string().optional(),
 category: z.string().optional(),
 tags: z.array(z.string()).optional(),
 status: z.enum(["draft", "published", "archived"]).optional(),
 scheduledAt: z.string().datetime().optional().nullable(),
});

export const projectSchema = z.object({
 title: z.string().min(1),
 slug: z.string().min(1),
 description: z.string().optional(),
 techStack: z.array(z.string()).optional(),
 liveUrl: z.string().optional(),
 repoUrl: z.string().optional(),
 imageUrl: z.string().optional(),
 featured: z.boolean().optional(),
 order: z.number().optional(),
});

export const cvSectionSchema = z.object({
 type: z.enum(["experience", "education", "skill", "award"]),
 title: z.string().min(1),
 subtitle: z.string().optional(),
 description: z.string().optional(),
 logoUrl: z.string().optional(),
 location: z.string().optional(),
 startDate: z.string().optional(),
 endDate: z.string().optional(),
 order: z.number(),
});

export const createUserSchema = z.object({
 name: z.string().min(1),
 email: z.string().email(),
 password: z.string().min(6).optional(),
});
