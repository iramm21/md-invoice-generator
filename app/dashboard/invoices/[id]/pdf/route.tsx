// app/dashboard/invoices/[id]/pdf/route.tsx
import { db } from "@/lib/prisma";
import InvoicePDF from "@/lib/pdf/InvoicePDF";
import { requireSession } from "@/lib/session";
import { renderToStream } from "@react-pdf/renderer";

// ✅ force Node runtime
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
    <InvoicePDF title={invoice.title} content={invoice.markdown} />
  );

  return new Response(pdfStream as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${invoice.title}.pdf"`,
    },
  });
}
