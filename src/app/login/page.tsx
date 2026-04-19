"use client";

import { signIn } from "next-auth/react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
 return (
  <Suspense>
   <LoginForm />
  </Suspense>
 );
}

function LoginForm() {
 const searchParams = useSearchParams();
 const callbackUrl = searchParams.get("callbackUrl") || "/";
 const error = searchParams.get("error");

 return (
  <div className="flex min-h-screen items-center justify-center">
   <div className="w-full max-w-sm space-y-6 p-6">
    <h1 className="text-center text-2xl font-bold">Sign In</h1>

    <div className="space-y-3">
     <Button type="button" className="w-full" onClick={() => signIn("github", { callbackUrl })}>
      Continue with GitHub
     </Button>

     <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => signIn("google", { callbackUrl })}
     >
      Continue with Google
     </Button>
    </div>

    {error && (
     <p className="text-center text-sm text-red-500">
      {error === "AccessDenied"
       ? "This account isn't authorized to sign in."
       : "Sign-in failed. Please try again."}
     </p>
    )}
   </div>
  </div>
 );
}
