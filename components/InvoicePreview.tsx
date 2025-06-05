"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function InvoicePreview({ markdown }: { markdown: string }) {
  return (
    <div className="prose max-w-none border p-4 rounded bg-white shadow">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
    </div>
  );
}
