// app/dashboard/invoices/[id]/pdf/route.tsx

import { db } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { renderToStream } from "@react-pdf/renderer";
import InvoicePDF from "@/lib/pdf/InvoicePDF";

export const runtime = "nodejs";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await requireSession();

  const invoice = await db.invoice.findFirst({
    where: {
      id: params.id,
      userId: session.user.id,
    },
  });

  if (!invoice) {
    return new Response("Not found", { status: 404 });
  }

  const pdfStream = await renderToStream(
    <InvoicePDF
      title={invoice.title}
      content={invoice.markdown}
      clientName={invoice.clientName}
      clientEmail={invoice.clientEmail || ""}
      issueDate={invoice.issueDate.toISOString().split("T")[0]}
      dueDate={invoice.dueDate.toISOString().split("T")[0]}
      taxRate={invoice.taxRate}
      discount={invoice.discount}
      companyLogo={invoice.companyLogo || ""}
      notes={invoice.notes || ""}
    />
  );

  return new Response(pdfStream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.title}.pdf"`,
    },
  });
}
