import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 sm:px-10 py-16 bg-white dark:bg-black text-gray-900 dark:text-white font-sans">
      <header className="text-center mb-12">
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={120}
          height={32}
          className="mx-auto mb-4 dark:invert"
        />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Markdown Invoice Generator
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Create, preview, and export invoices using clean Markdown. Fast,
          minimal, and perfect for freelancers & devs.
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/auth/register"
          className="rounded-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 font-medium text-sm sm:text-base hover:opacity-90 transition"
        >
          Get Started
        </Link>
        <Link
          href="/dashboard/invoices"
          className="rounded-full border border-gray-300 dark:border-gray-600 px-6 py-3 font-medium text-sm sm:text-base hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          View Dashboard
        </Link>
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-gray-300 dark:border-gray-600 px-6 py-3 font-medium text-sm sm:text-base hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          GitHub
        </a>
      </div>

      <footer className="mt-16 text-xs text-gray-500 dark:text-gray-600 text-center">
        Built with Next.js 14 App Router — Tailwind CSS — Prisma
      </footer>
    </div>
  );
}
