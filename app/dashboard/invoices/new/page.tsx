import { createInvoice } from "@/lib/actions/invoice";

export default function NewInvoicePage() {
  return (
    <div className="min-h-screen px-6 sm:px-10 py-16 bg-white dark:bg-black text-gray-900 dark:text-white font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Create New Invoice</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Use markdown to write your invoice. You can preview and export it
            later.
          </p>
        </div>

        <form
          action={createInvoice}
          className="space-y-6 bg-white dark:bg-neutral-900 p-6 border border-gray-200 dark:border-gray-800 rounded-xl shadow"
        >
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Invoice Title"
              required
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="markdown" className="block text-sm font-medium">
              Markdown
            </label>
            <textarea
              id="markdown"
              name="markdown"
              rows={12}
              required
              placeholder="Write your invoice in markdown..."
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black dark:bg-white text-white dark:text-black font-semibold py-3 rounded-full hover:opacity-90 transition"
          >
            Save Invoice
          </button>
        </form>
      </div>
    </div>
  );
}
