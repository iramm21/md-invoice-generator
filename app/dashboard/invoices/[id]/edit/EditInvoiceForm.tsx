"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateInvoice } from "@/lib/actions/invoice";
import type { Invoice } from "@prisma/client";
import Image from "next/image";

type Props = { invoice: Invoice };

export default function EditInvoiceForm({ invoice }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: invoice.title,
    clientName: invoice.clientName,
    clientEmail: invoice.clientEmail || "",
    issueDate: invoice.issueDate.toISOString().split("T")[0],
    dueDate: invoice.dueDate.toISOString().split("T")[0],
    notes: invoice.notes || "",
    companyLogoUrl: invoice.companyLogo || "",
    taxRate: invoice.taxRate,
    discount: invoice.discount,
  });

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("clientName", formData.clientName);
    payload.append("clientEmail", formData.clientEmail);
    payload.append("issueDate", formData.issueDate);
    payload.append("dueDate", formData.dueDate);
    payload.append("notes", formData.notes);
    payload.append("taxRate", formData.taxRate.toString());
    payload.append("discount", formData.discount.toString());
    payload.append("companyLogoUrl", formData.companyLogoUrl);
    payload.append("markdown", invoice.markdown);

    const file = fileInputRef.current?.files?.[0];
    if (file) {
      payload.append("logoFile", file);
    }

    startTransition(async () => {
      await updateInvoice(invoice.id, payload);
      router.push(`/dashboard/invoices/${invoice.id}`);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
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
          <label className="block mb-1 font-medium">
            Upload New Logo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="w-full input"
          />
          {formData.companyLogoUrl && (
            <div className="mt-2">
              <Image
                src={formData.companyLogoUrl}
                alt="Current Logo"
                width={160}
                height={48}
                className="object-contain h-12 w-auto"
              />
            </div>
          )}
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

        <div>
          <label className="block mb-1 font-medium">Tax Rate (%)</label>
          <input
            type="number"
            value={formData.taxRate}
            onChange={(e) => handleChange("taxRate", e.target.value)}
            className="w-full input"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Discount (%)</label>
          <input
            type="number"
            value={formData.discount}
            onChange={(e) => handleChange("discount", e.target.value)}
            className="w-full input"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full input"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-black text-white px-6 py-3 rounded-md font-medium hover:opacity-90 transition"
      >
        {isPending ? "Updating..." : "Update Invoice"}
      </button>
    </form>
  );
}
