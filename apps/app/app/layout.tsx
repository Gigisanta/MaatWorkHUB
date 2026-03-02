import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Toaster } from "@maatwork/ui";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Maatwork Client",
  description: "Client Management Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans bg-background text-foreground min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
