import type { Metadata } from "next";
import { Albert_Sans, Space_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import "@/styles/globals.css";

const albertSans = Albert_Sans({
 variable: "--font-albert-sans",
 subsets: ["latin"],
});

const spaceMono = Space_Mono({
 variable: "--font-space-mono",
 subsets: ["latin"],
 weight: "400",
});

export const metadata: Metadata = {
 title: "Atlas",
 description: "Personal portfolio site",
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <html
   lang="en"
   suppressHydrationWarning
   className={`${albertSans.variable} ${spaceMono.variable} h-full antialiased`}
  >
   <body className="min-h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50">
    <ThemeProvider>{children}</ThemeProvider>
   </body>
  </html>
 );
}
