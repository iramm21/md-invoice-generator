// app/dashboard/invoices/page.tsx

import { db } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import InvoiceListPageClient from "./InvoiceListPage";

export default async function InvoiceListPage() {
  const session = await requireSession();
  const invoices = await db.invoice.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      createdAt: true,
    },
  });

  return <InvoiceListPageClient invoices={invoices} />;
}
