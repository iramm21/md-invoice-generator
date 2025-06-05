"use client";

import { useState } from "react";

type Props = {
  initial?: string;
  onChange: (value: string) => void;
};

export default function InvoiceEditor({ initial = "", onChange }: Props) {
  const [markdown, setMarkdown] = useState(initial);

  return (
    <textarea
      value={markdown}
      onChange={(e) => {
        setMarkdown(e.target.value);
        onChange(e.target.value);
      }}
      className="w-full h-96 p-4 border border-gray-300 rounded"
      placeholder="Write your invoice in Markdown..."
    />
  );
}
