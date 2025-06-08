"use server";

import { db } from "../prisma";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

// Must accept `(prevState, formData)` for useActionState to work
export async function registerUser(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, message: "User already exists" };
  }

  const hashed = await bcrypt.hash(password, 10);
  await db.user.create({ data: { email, password: hashed } });

  redirect("/auth/login");
}

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error("Invalid password");

  redirect("/dashboard");
}
