"use server";

import { db } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export async function createInvoice(formData: FormData) {
  const session = await requireSession();

  const title = formData.get("title") as string;
  const markdown = formData.get("markdown") as string;

  if (!title || !markdown) {
    throw new Error("Missing fields");
  }

  const invoice = await db.invoice.create({
    data: {
      title,
      markdown,
      userId: session.user.id,
    },
  });

  return invoice.id; // ✅ Return the ID
}
