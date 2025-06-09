"use server";

import { db } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function createInvoice(formData: FormData) {
  const session = await requireSession();

  if (!session?.user?.id) {
    throw new Error("User is not authenticated or session is invalid");
  }

  const title = formData.get("title") as string;
  const markdown = formData.get("markdown") as string;
  const clientName = formData.get("clientName") as string;
  const clientEmail = formData.get("clientEmail") as string;
  const issueDate = formData.get("issueDate") as string;
  const dueDate = formData.get("dueDate") as string;
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const taxRate = parseFloat(formData.get("taxRate") as string) || 0;
  const companyLogo = formData.get("companyLogoUrl") as string;
  const notes = formData.get("notes") as string;

  if (!title || !markdown || !clientName || !issueDate || !dueDate) {
    throw new Error("Missing required fields.");
  }

  const invoice = await db.invoice.create({
    data: {
      title,
      markdown,
      clientName,
      clientEmail,
      issueDate: new Date(issueDate),
      dueDate: new Date(dueDate),
      discount,
      taxRate,
      companyLogo,
      notes,
      userId: session.user.id,
    },
  });

  return invoice.id;
}
