// app/dashboard/invoices/[id]/edit/page.tsx

import { db } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import EditInvoiceForm from "./EditInvoiceForm";

type Props = {
  params: { id: string };
};

export default async function EditInvoicePage({ params }: Props) {
  const session = await requireSession();

  const invoice = await db.invoice.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 text-lg">
        Invoice not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Edit Invoice
      </h1>
      <EditInvoiceForm invoice={invoice} />
    </div>
  );
}
