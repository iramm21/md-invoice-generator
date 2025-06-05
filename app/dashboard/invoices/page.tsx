import { db } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import Link from "next/link";

export default async function InvoiceListPage() {
  const session = await requireSession();
  const invoices = await db.invoice.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen px-6 sm:px-10 py-16 bg-white dark:bg-black text-gray-900 dark:text-white font-sans">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold">Your Invoices</h1>
          <Link
            href="/dashboard/invoices/new"
            className="inline-block bg-black dark:bg-white text-white dark:text-black font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition"
          >
            + New Invoice
          </Link>
        </div>

        {invoices.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            You haven’t created any invoices yet.
          </p>
        ) : (
          <ul className="grid gap-4">
            {invoices.map((inv) => (
              <li
                key={inv.id}
                className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm hover:shadow-md transition"
              >
                <Link href={`/dashboard/invoices/${inv.id}`} className="block">
                  <h2 className="text-xl font-semibold mb-1">{inv.title}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(inv.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
