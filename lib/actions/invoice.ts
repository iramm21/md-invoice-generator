"use server";

import { db } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { redirect } from "next/navigation";

export async function createInvoice(formData: FormData) {
  const session = await requireSession();

  const title = formData.get("title") as string;
  const markdown = formData.get("markdown") as string;

  await db.invoice.create({
    data: {
      title,
      markdown,
      userId: session.user.id,
    },
  });

  redirect("/dashboard/invoices");
}
