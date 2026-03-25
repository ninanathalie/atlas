import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
 adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
 session: { strategy: "jwt" },
 pages: {
  signIn: "/login",
 },
 providers: [
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
   ? [
      GoogleProvider({
       clientId: process.env.GOOGLE_CLIENT_ID,
       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
     ]
   : []),
  ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
   ? [
      GitHubProvider({
       clientId: process.env.GITHUB_CLIENT_ID,
       clientSecret: process.env.GITHUB_CLIENT_SECRET,
      }),
     ]
   : []),
  CredentialsProvider({
   name: "Credentials",
   credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
   },
   async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) return null;

    const user = await prisma.user.findUnique({
     where: { email: credentials.email },
    });

    if (!user || !user.passwordHash) return null;

    const valid = await bcrypt.compare(credentials.password, user.passwordHash);
    if (!valid) return null;

    return { id: user.id, email: user.email, name: user.name };
   },
  }),
 ],
 callbacks: {
  async signIn({ user, account, profile }) {
   if (account?.provider === "credentials") return true;

   const email = user.email ?? (profile as { email?: string })?.email;
   if (!email || !account) return false;

   const existing = await prisma.user.findUnique({
    where: { email },
   });
   if (!existing) return false;

   // Auto-link OAuth account if not already linked
   const linked = await prisma.account.findUnique({
    where: {
     provider_providerAccountId: {
      provider: account.provider,
      providerAccountId: account.providerAccountId,
     },
    },
   });

   if (!linked) {
    await prisma.account.create({
     data: {
      userId: existing.id,
      type: account.type,
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      refresh_token: account.refresh_token as string | undefined,
      access_token: account.access_token as string | undefined,
      expires_at: account.expires_at as number | undefined,
      token_type: account.token_type as string | undefined,
      scope: account.scope as string | undefined,
      id_token: account.id_token as string | undefined,
      session_state: account.session_state as string | undefined,
     },
    });
   }

   return true;
  },
  async jwt({ token, user }) {
   if (user) token.id = user.id;

   if (!token.id && token.email) {
    const dbUser = await prisma.user.findUnique({
     where: { email: token.email },
    });
    if (dbUser) token.id = dbUser.id;
   }
   return token;
  },
  session({ session, token }) {
   if (session.user) session.user.id = token.id as string;
   return session;
  },
 },
};
