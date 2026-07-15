import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CheckCheck } from "lucide-react";
import { NavLink } from "@/components/nav-link";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Day-wise task manager",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-muted/40">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
            <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-4 py-3.5 sm:px-6">
              <div className="mr-2 flex items-center gap-2 sm:mr-4">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground text-background">
                  <CheckCheck className="size-3.5" strokeWidth={2.5} />
                </span>
                <span className="text-[15px] font-semibold tracking-tight whitespace-nowrap text-foreground">
                  Task Manager
                </span>
              </div>
              <nav className="flex items-center gap-1">
                <NavLink href="/">Dashboard</NavLink>
                <NavLink href="/completed">Completed</NavLink>
              </nav>
              <div className="ml-auto flex items-center">
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
