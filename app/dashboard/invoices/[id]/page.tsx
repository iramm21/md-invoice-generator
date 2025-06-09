import { db } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = {
  params: { id: string };
};

export default async function InvoiceDetailPage({ params }: Props) {
  const session = await requireSession();

  const invoice = await db.invoice.findFirst({
    where: { id: params.id, userId: session.user.id },
  });

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Invoice not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 sm:px-10 py-16 bg-white dark:bg-black text-gray-900 dark:text-white font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{invoice.title}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Created: {new Date(invoice.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-neutral-900 p-6 shadow-md prose dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {invoice.markdown}
          </ReactMarkdown>
        </div>

        <div>
          <Link
            href={`/dashboard/invoices/${params.id}/edit`}
            className="ml-4 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition"
          >
            Edit Invoice
          </Link>
          <Link
            href={`/dashboard/invoices/${params.id}/pdf`}
            target="_blank"
            className="inline-block bg-black dark:bg-white text-white dark:text-black font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition"
          >
            Download PDF
          </Link>
        </div>
      </div>
    </div>
  );
}
