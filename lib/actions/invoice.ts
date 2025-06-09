"use server";

import { db } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { writeFile } from "fs/promises"; // ✅ required
import path from "path"; // ✅ required

// CREATE INVOICE
export async function createInvoice(formData: FormData) {
  const session = await requireSession();

  if (!session?.user?.id) {
    throw new Error("User is not authenticated or session is invalid");
  }

  let companyLogo = "";

  const file = formData.get("logoFile") as File;
  if (file && typeof file === "object") {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadPath = path.join(process.cwd(), "public/uploads", filename);
    await writeFile(uploadPath, buffer);
    companyLogo = `/uploads/${filename}`;
  }

  const title = formData.get("title") as string;
  const markdown = formData.get("markdown") as string;
  const clientName = formData.get("clientName") as string;
  const clientEmail = formData.get("clientEmail") as string;
  const issueDate = formData.get("issueDate") as string;
  const dueDate = formData.get("dueDate") as string;
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const taxRate = parseFloat(formData.get("taxRate") as string) || 0;
  const notes = formData.get("notes") as string;

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
      userId: session.user.id,
    },
  });
}

// UPDATE INVOICE
export async function updateInvoice(id: string, formData: FormData) {
  const session = await requireSession();
  if (!session?.user?.id) throw new Error("Not authenticated");

  let companyLogo = formData.get("companyLogoUrl") as string;

  const file = formData.get("logoFile") as File;
  if (file && typeof file === "object") {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filename = `${Date.now()}-${file.name}`;
    const uploadPath = path.join(process.cwd(), "public/uploads", filename);
    await writeFile(uploadPath, buffer);
    companyLogo = `/uploads/${filename}`;
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
    companyLogo,
    notes: formData.get("notes") as string,
  };

  const updated = await db.invoice.updateMany({
    where: { id, userId: session.user.id },
    data,
  });

  if (updated.count === 0)
    throw new Error("Invoice not found or not authorized.");

  return id;
}
