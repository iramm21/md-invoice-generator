import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import AuthProvider from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Invoice Generator",
  description: "Markdown-based invoicing SaaS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
