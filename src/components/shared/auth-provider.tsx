"use client";

import { SessionProvider } from "next-auth/react";
import { createContext, useContext } from "react";

type AuthContextType = {
 isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType>({ isAdmin: false });

export function useIsAdmin() {
 return useContext(AuthContext).isAdmin;
}

export function AuthProvider({
 children,
 isAdmin,
}: {
 children: React.ReactNode;
 isAdmin: boolean;
}) {
 return (
  <SessionProvider>
   <AuthContext value={{ isAdmin }}>{children}</AuthContext>
  </SessionProvider>
 );
}
