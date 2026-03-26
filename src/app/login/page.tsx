"use client";

import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
 return (
  <Suspense>
   <LoginForm />
  </Suspense>
 );
}

function LoginForm() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const callbackUrl = searchParams.get("callbackUrl") || "/";
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);

 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError("");
  setLoading(true);

  const result = await signIn("credentials", {
   email,
   password,
   redirect: false,
   callbackUrl,
  });

  setLoading(false);

  if (result?.error) {
   setError("Invalid email or password");
  } else {
   const targetUrl = result?.url || "/";
   router.push(targetUrl);
   router.refresh();
  }
 }

 return (
  <div className="flex min-h-screen items-center justify-center">
   <div className="w-full max-w-sm space-y-6 p-6">
    <h1 className="text-center text-2xl font-bold">Sign In</h1>

    <form onSubmit={handleSubmit} className="space-y-4">
     <div>
      <label htmlFor="email" className="block text-sm font-medium">
       Email
      </label>
      <input
       id="email"
       type="email"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       required
       className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      />
     </div>

     <div>
      <label htmlFor="password" className="block text-sm font-medium">
       Password
      </label>
      <input
       id="password"
       type="password"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       required
       className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      />
     </div>

     {error && <p className="text-sm text-red-500">{error}</p>}

     <Button type="submit" className="w-full" disabled={loading}>
      {loading ? "Signing in..." : "Sign In"}
     </Button>
    </form>
   </div>
  </div>
 );
}
