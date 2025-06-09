"use server";

import { db } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

// CREATE INVOICE
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

// DELETE INVOICE
export async function deleteInvoice(id: string) {
  const session = await requireSession();

  if (!session?.user?.id) {
    throw new Error("User is not authenticated or session is invalid");
  }

  await db.invoice.delete({
    where: {
      id,
      userId: session.user.id, // ✅ Will fail safely if user mismatch
    },
  });
}

// UPDATE INVOICE
export async function updateInvoice(id: string, formData: FormData) {
  const session = await requireSession();

  if (!session?.user?.id) {
    throw new Error("User is not authenticated or session is invalid");
  }

  const data = {
    title: formData.get("title") as string,
    markdown: formData.get("markdown") as string,
    clientName: formData.get("clientName") as string,
    clientEmail: formData.get("clientEmail") as string,
    issueDate: new Date(formData.get("issueDate") as string),
    dueDate: new Date(formData.get("dueDate") as string),
    discount: parseFloat(formData.get("discount") as string) || 0,
    taxRate: parseFloat(formData.get("taxRate") as string) || 0,
    companyLogo: formData.get("companyLogoUrl") as string,
    notes: formData.get("notes") as string,
  };

  const updated = await db.invoice.updateMany({
    where: {
      id,
      userId: session.user.id,
    },
    data,
  });

  if (updated.count === 0) {
    throw new Error("Invoice not found or not authorized.");
  }

  return id;
}
