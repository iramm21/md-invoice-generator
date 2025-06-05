"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value;
    const password = form.password.value;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/dashboard/invoices");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-10 py-16 bg-white dark:bg-black text-gray-900 dark:text-white font-sans">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 bg-white dark:bg-neutral-900 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-800"
      >
        <h1 className="text-2xl font-bold text-center">Log In</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />

        <button
          type="submit"
          className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-3 rounded-full hover:opacity-90 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/register"
            className="underline hover:text-black dark:hover:text-white"
          >
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
