"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm font-medium text-gray-500 hover:text-black dark:hover:text-white"
    >
      Logout
    </button>
  );
}
