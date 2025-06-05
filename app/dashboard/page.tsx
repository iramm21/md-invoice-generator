import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardHome() {
  const session = await getServerSession(authConfig);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Welcome back, {session?.user?.email?.split('@')[0]} 👋</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your invoices easily with Markdown. Start by creating a new
          invoice or browsing your existing ones.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard/invoices/new"
          className="bg-black dark:bg-white text-white dark:text-black font-semibold px-6 py-3 rounded-full hover:opacity-90 transition text-center"
        >
          + Create Invoice
        </Link>
        <Link
          href="/dashboard/invoices"
          className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition text-center"
        >
          View Invoices
        </Link>
      </div>
    </div>
  );
}
