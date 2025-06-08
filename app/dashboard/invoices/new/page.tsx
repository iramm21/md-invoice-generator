"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createInvoice } from "@/lib/actions/invoice";

type InvoiceItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export default function NewInvoicePage() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const handleChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [field]: field === "description" ? value : Number(value),
    };
    setItems(updated);
  };

  const total = items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const markdown = `| Description | Quantity | Unit Price | Total |
|-------------|----------|------------|-------|
${items
  .map(
    (item) =>
      `| ${item.description} | ${item.quantity} | $${item.unitPrice.toFixed(
        2
      )} | $${(item.quantity * item.unitPrice).toFixed(2)} |`
  )
  .join("\n")}
`;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("markdown", markdown);

    startTransition(async () => {
      const id = await createInvoice(formData);
      if (id) {
        router.push(`/dashboard/invoices/${id}`);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Create New Invoice
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
            Invoice Title
          </label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g. Website Development"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-neutral-900 text-sm shadow-sm focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
          />
        </div>

        <div className="space-y-4">
          <label className="block font-medium text-gray-700 dark:text-gray-300">
            Line Items
          </label>

          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-gray-50 dark:bg-neutral-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
                required
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-900 text-sm"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleChange(index, "quantity", e.target.value)
                }
                required
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-900 text-sm"
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) =>
                  handleChange(index, "unitPrice", e.target.value)
                }
                required
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-neutral-900 text-sm"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Item
          </button>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            Total: ${total.toFixed(2)}
          </span>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full md:w-auto bg-black dark:bg-white text-white dark:text-black font-medium px-6 py-2.5 rounded-md hover:opacity-90 transition"
        >
          {isPending ? "Saving..." : "Save Invoice"}
        </button>
      </form>
    </div>
  );
}
