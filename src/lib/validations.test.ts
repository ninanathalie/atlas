import { describe, it, expect } from "vitest";
import {
 profileUpdateSchema,
 settingsSchema,
 postSchema,
 projectSchema,
 createUserSchema,
} from "./validations";

describe("profileUpdateSchema", () => {
 it("accepts valid profile", () => {
  const result = profileUpdateSchema.safeParse({
   name: "Nathalie",
   title: "Frontend Developer",
  });
  expect(result.success).toBe(true);
 });

 it("requires name", () => {
  const result = profileUpdateSchema.safeParse({
   title: "Developer",
  });
  expect(result.success).toBe(false);
 });
});

describe("settingsSchema", () => {
 it("accepts valid settings", () => {
  const result = settingsSchema.safeParse({
   siteTitle: "My Portfolio",
   maintenanceMode: false,
  });
  expect(result.success).toBe(true);
 });

 it("requires siteTitle", () => {
  const result = settingsSchema.safeParse({});
  expect(result.success).toBe(false);
 });
});

describe("postSchema", () => {
 it("accepts valid post", () => {
  const result = postSchema.safeParse({
   title: "My Post",
   slug: "my-post",
   content: "Hello world",
  });
  expect(result.success).toBe(true);
 });

 it("requires title, slug, content", () => {
  const result = postSchema.safeParse({
   title: "My Post",
  });
  expect(result.success).toBe(false);
 });
});

describe("projectSchema", () => {
 it("accepts valid project", () => {
  const result = projectSchema.safeParse({
   title: "Atlas",
   slug: "atlas",
  });
  expect(result.success).toBe(true);
 });

 it("accepts project with tech stack", () => {
  const result = projectSchema.safeParse({
   title: "Atlas",
   slug: "atlas",
   techStack: ["Next.js", "TypeScript"],
  });
  expect(result.success).toBe(true);
 });
});

describe("createUserSchema", () => {
 it("accepts valid user", () => {
  const result = createUserSchema.safeParse({
   name: "Jane",
   email: "jane@example.com",
  });
  expect(result.success).toBe(true);
 });

 it("requires valid email", () => {
  const result = createUserSchema.safeParse({
   name: "Jane",
   email: "not-an-email",
  });
  expect(result.success).toBe(false);
 });

 it("rejects short password", () => {
  const result = createUserSchema.safeParse({
   name: "Jane",
   email: "jane@example.com",
   password: "12345",
  });
  expect(result.success).toBe(false);
 });

 it("accepts password with 6+ chars", () => {
  const result = createUserSchema.safeParse({
   name: "Jane",
   email: "jane@example.com",
   password: "123456",
  });
  expect(result.success).toBe(true);
 });
});
