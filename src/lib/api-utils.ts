import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";

/**
 * Returns a consistent JSON error response.
 */
export function jsonError(message: string, status: number) {
 return NextResponse.json({ error: message }, { status });
}

/**
 * Checks if a Prisma error is a "record not found" error (P2025).
 */
export function isNotFoundError(error: unknown): boolean {
 return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

/**
 * Checks for an authenticated session.
 * Returns the session if authenticated, or an error response if not.
 */
export async function requireAuth() {
 const session = await getServerSession(authOptions);
 if (!session) {
  return { session: null as never, error: jsonError("Unauthorized", 401) };
 }
 return { session, error: null };
}
