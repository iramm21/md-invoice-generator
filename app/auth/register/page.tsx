"use client";

import { useActionState } from "react";
import { registerUser } from "@/lib/actions/auth";

const initialState = {
  success: true,
  message: "",
};

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerUser, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 sm:px-10 py-16 bg-white dark:bg-black text-gray-900 dark:text-white font-sans">
      <form
        action={formAction}
        className="w-full max-w-md space-y-6 bg-white dark:bg-neutral-900 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-800"
      >
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>

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

        {state?.success === false && (
          <p className="text-red-500 text-sm text-center">{state.message}</p>
        )}

        <button
          type="submit"
          className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-3 rounded-full hover:opacity-90 transition"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="underline hover:text-black dark:hover:text-white"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
