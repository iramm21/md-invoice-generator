import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import Link from "next/link";
import SignOutButton from "@/components/SignOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authConfig);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Unauthorized
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans">
      <nav className="border-b border-gray-200 dark:border-gray-800 px-6 sm:px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className="text-lg font-bold tracking-tight hover:opacity-80"
          >
            InvoiceGen
          </Link>
          <Link
            href="/dashboard/invoices"
            className="hover:text-black dark:hover:text-white transition"
          >
            Invoices
          </Link>
          <Link
            href="/dashboard/invoices/new"
            className="hover:text-black dark:hover:text-white transition"
          >
            New Invoice
          </Link>
        </div>
        <SignOutButton />
      </nav>
      <main className="px-6 sm:px-10 py-12">{children}</main>
    </div>
  );
}
