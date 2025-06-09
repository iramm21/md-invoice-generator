"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createInvoice } from "@/lib/actions/invoice";
import type { InvoiceItem, InvoiceFormData } from "@/types/invoice";

export default function NewInvoicePage() {
  const [formData, setFormData] = useState<InvoiceFormData>({
    title: "",
    clientName: "",
    clientEmail: "",
    issueDate: "",
    dueDate: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
    notes: "",
    logoFile: undefined,
  });
  const [discount, setDiscount] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string
  ) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === "description" ? value : Number(value),
    };
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: 0 }],
    }));
  };

  const subtotal = formData.items.reduce(
    (acc, item) => acc + item.quantity * item.unitPrice,
    0
  );
  const taxAmount = (subtotal * taxRate) / 100;
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const handleChange = (field: keyof InvoiceFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const markdown = `| Description | Quantity | Unit Price | Total |
|-------------|----------|------------|-------|
${formData.items
  .map(
    (item) =>
      `| ${item.description} | ${item.quantity} | $${item.unitPrice.toFixed(
        2
      )} | $${(item.quantity * item.unitPrice).toFixed(2)} |`
  )
  .join("\n")}`;

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("clientName", formData.clientName);
    payload.append("clientEmail", formData.clientEmail ?? "");
    payload.append("issueDate", formData.issueDate);
    payload.append("dueDate", formData.dueDate);
    payload.append("notes", formData.notes ?? "");
    payload.append("markdown", markdown);
    payload.append("discount", discount.toString());
    payload.append("taxRate", taxRate.toString());

    if (formData.logoFile) {
      payload.append("logoFile", formData.logoFile);
    }

    startTransition(async () => {
      const id = await createInvoice(payload);
      if (id) router.push(`/dashboard/invoices/${id}`);
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
        Create New Invoice
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Top Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Invoice Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="w-full input"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Company Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  logoFile: e.target.files?.[0],
                }))
              }
              className="w-full input"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Client Name</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={(e) => handleChange("clientName", e.target.value)}
              className="w-full input"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Client Email</label>
            <input
              type="email"
              value={formData.clientEmail}
              onChange={(e) => handleChange("clientEmail", e.target.value)}
              className="w-full input"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Issue Date</label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => handleChange("issueDate", e.target.value)}
              className="w-full input"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
              className="w-full input"
              required
            />
          </div>
        </div>

        {/* Items */}
        <div>
          <label className="block font-medium mb-2">Line Items</label>
          {formData.items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3"
            >
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                className="input"
                required
              />
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="input"
                required
              />
              <input
                type="number"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) =>
                  handleItemChange(index, "unitPrice", e.target.value)
                }
                className="input"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Item
          </button>
        </div>

        {/* Finance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block mb-1 font-medium">Discount (%)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full input"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tax Rate (%)</label>
            <input
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(Number(e.target.value))}
              className="w-full input"
            />
          </div>
        </div>

        {/* Total */}
        <div className="text-right font-semibold text-xl mt-4">
          Final Total: ${total.toFixed(2)}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="bg-black text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
        >
          {isPending ? "Saving..." : "Save Invoice"}
        </button>
      </form>
    </div>
  );
}
