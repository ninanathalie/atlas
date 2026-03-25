import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

/**
 * Returns a consistent JSON error response.
 */
export function jsonError(message: string, status: number) {
 return NextResponse.json({ error: message }, { status });
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
